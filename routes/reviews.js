const express = require('express');
const router = express.Router();
const reviews = require('../data/reviews');
const books = require('../data/books');
const { authenticateToken } = require('../middleware/auth');

// Task 5: Get book Review
router.get('/:isbn', (req, res) => {
  try {
    const isbn = req.params.isbn;
    const bookReviews = reviews.filter(r => r.isbn === isbn);
    
    if (bookReviews.length === 0) {
      return res.status(404).json({ error: 'No reviews found for this book' });
    }
    
    res.json({
      success: true,
      isbn: isbn,
      count: bookReviews.length,
      reviews: bookReviews.map(r => ({
        id: r.id,
        isbn: r.isbn,
        username: r.username,
        review: r.review,
        rating: r.rating,
        date: r.date
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

// Task 8: Add/Modify a book review (requires authentication)
router.post('/:isbn', authenticateToken, (req, res) => {
  try {
    const isbn = req.params.isbn;
    const { review, rating } = req.body;
    const username = req.user.username;

    // Validation
    if (!review || !rating) {
      return res.status(400).json({ error: 'Review and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if book exists
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if user already has a review for this book
    const existingReviewIndex = reviews.findIndex(
      r => r.isbn === isbn && r.username === username
    );

    if (existingReviewIndex !== -1) {
      // Modify existing review
      reviews[existingReviewIndex].review = review;
      reviews[existingReviewIndex].rating = rating;
      reviews[existingReviewIndex].date = new Date().toISOString();

      return res.json({
        success: true,
        message: 'Review updated successfully',
        review: {
          id: reviews[existingReviewIndex].id,
          isbn: isbn,
          username: username,
          review: review,
          rating: rating,
          date: reviews[existingReviewIndex].date
        }
      });
    } else {
      // Add new review
      const newReview = {
        id: reviews.length + 1,
        isbn: isbn,
        username: username,
        review: review,
        rating: rating,
        date: new Date().toISOString()
      };

      reviews.push(newReview);

      return res.status(201).json({
        success: true,
        message: 'Review added successfully',
        review: newReview
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add/modify review' });
  }
});

// Task 9: Delete book review added by that particular user (requires authentication)
router.delete('/:isbn', authenticateToken, (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.user.username;

    // Find the review
    const reviewIndex = reviews.findIndex(
      r => r.isbn === isbn && r.username === username
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Delete the review
    const deletedReview = reviews.splice(reviewIndex, 1)[0];

    res.json({
      success: true,
      message: 'Review deleted successfully',
      deletedReview: {
        id: deletedReview.id,
        isbn: deletedReview.isbn,
        username: deletedReview.username
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;

