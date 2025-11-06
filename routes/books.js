const express = require('express');
const router = express.Router();
const books = require('../data/books');

// Task 1: Get the book list available in the shop
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: books.length,
      books: books
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
});

// Task 2: Get the books based on ISBN
router.get('/isbn/:isbn', (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({
      success: true,
      book: book
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve book' });
  }
});

// Task 3: Get all books by Author
router.get('/author/:author', (req, res) => {
  try {
    const author = decodeURIComponent(req.params.author);
    const authorBooks = books.filter(b => 
      b.author.toLowerCase().includes(author.toLowerCase())
    );
    
    if (authorBooks.length === 0) {
      return res.status(404).json({ error: 'No books found for this author' });
    }
    
    res.json({
      success: true,
      count: authorBooks.length,
      books: authorBooks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books by author' });
  }
});

// Task 4: Get all books based on Title
router.get('/title/:title', (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title);
    const titleBooks = books.filter(b => 
      b.title.toLowerCase().includes(title.toLowerCase())
    );
    
    if (titleBooks.length === 0) {
      return res.status(404).json({ error: 'No books found with this title' });
    }
    
    res.json({
      success: true,
      count: titleBooks.length,
      books: titleBooks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books by title' });
  }
});

module.exports = router;

