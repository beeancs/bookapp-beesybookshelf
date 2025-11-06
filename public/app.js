// API Base URL - Automatically detects environment
// For local development: uses localhost
// For production: uses same domain (Railway serves both frontend and backend)
const API_BASE = (() => {
    // Check if running on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    // For production (Railway, Render, etc.) - use same domain
    // Since Railway serves both frontend and backend from the same URL
    return `${window.location.origin}/api`;
})();

// State Management
let currentUser = null;
let authToken = null;
let currentBookISBN = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    loadAllBooks();
    
    // Close modal when clicking outside
    window.onclick = (event) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    };
});

// ==================== AUTHENTICATION ====================

function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        usernameDisplay.textContent = `👤 ${currentUser.username}`;
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

function showLoginModal() {
    document.getElementById('login-modal').classList.add('show');
    document.getElementById('login-error').style.display = 'none';
}

function showRegisterModal() {
    document.getElementById('register-modal').classList.add('show');
    document.getElementById('register-error').style.display = 'none';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Task 6: Register New User
async function handleRegister(event) {
    event.preventDefault();
    const errorDiv = document.getElementById('register-error');
    errorDiv.style.display = 'none';
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('Registration successful! Please login.');
            closeModal('register-modal');
            document.getElementById('register-form').reset();
            showLoginModal();
        } else {
            errorDiv.textContent = data.error || 'Registration failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
    }
}

// Task 7: Login as Registered User
async function handleLogin(event) {
    event.preventDefault();
    const errorDiv = document.getElementById('login-error');
    errorDiv.style.display = 'none';
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateAuthUI();
            closeModal('login-modal');
            document.getElementById('login-form').reset();
            showSuccess('Login successful!');
        } else {
            errorDiv.textContent = data.error || 'Login failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showSuccess('Logged out successfully');
}

// ==================== BOOK SEARCH ====================

function switchSearchTab(type) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide search forms
    document.querySelectorAll('.search-type').forEach(form => form.style.display = 'none');
    document.getElementById(`search-${type}`).style.display = 'flex';
}

// Task 1: Get the book list available in the shop
async function loadAllBooks() {
    showLoading(true);
    hideError();
    
    try {
        const response = await fetch(`${API_BASE}/books`);
        const data = await response.json();
        
        if (response.ok) {
            displayBooks(data.books || []);
        } else {
            showError(data.error || 'Failed to load books');
        }
    } catch (error) {
        showError('Network error. Please check if the server is running.');
    } finally {
        showLoading(false);
    }
}

// Task 2: Get books based on ISBN
async function searchByISBN() {
    const isbn = document.getElementById('isbn-input').value.trim();
    if (!isbn) {
        showError('Please enter an ISBN');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        const response = await fetch(`${API_BASE}/books/isbn/${encodeURIComponent(isbn)}`);
        const data = await response.json();
        
        if (response.ok) {
            displayBooks([data.book]);
        } else {
            showError(data.error || 'Book not found');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Task 3: Get all books by Author
async function searchByAuthor() {
    const author = document.getElementById('author-input').value.trim();
    if (!author) {
        showError('Please enter an author name');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        const response = await fetch(`${API_BASE}/books/author/${encodeURIComponent(author)}`);
        const data = await response.json();
        
        if (response.ok) {
            displayBooks(data.books || []);
        } else {
            showError(data.error || 'No books found for this author');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Task 4: Get all books based on Title
async function searchByTitle() {
    const title = document.getElementById('title-input').value.trim();
    if (!title) {
        showError('Please enter a book title');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        const response = await fetch(`${API_BASE}/books/title/${encodeURIComponent(title)}`);
        const data = await response.json();
        
        if (response.ok) {
            displayBooks(data.books || []);
        } else {
            showError(data.error || 'No books found with this title');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        showLoading(false);
    }
}

function displayBooks(books) {
    const container = document.getElementById('books-container');
    
    if (books.length === 0) {
        container.innerHTML = '<p class="no-reviews">No books found.</p>';
        return;
    }
    
    container.innerHTML = books.map(book => `
        <div class="book-card" onclick="showBookDetails('${book.isbn}')">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <div class="meta">
                <span class="year">${book.year}</span>
                <span class="genre">${book.genre}</span>
            </div>
            <p class="isbn">ISBN: ${book.isbn}</p>
        </div>
    `).join('');
}

// ==================== BOOK DETAILS & REVIEWS ====================

// Task 5: Get book Review
async function showBookDetails(isbn) {
    currentBookISBN = isbn;
    const modal = document.getElementById('book-modal');
    const bookDetailsDiv = document.getElementById('book-details');
    const reviewsContainer = document.getElementById('reviews-container');
    
    // Get book info
    try {
        const bookResponse = await fetch(`${API_BASE}/books/isbn/${encodeURIComponent(isbn)}`);
        const bookData = await bookResponse.json();
        
        if (bookResponse.ok) {
            const book = bookData.book;
            bookDetailsDiv.innerHTML = `
                <div class="book-details-content">
                    <h2>${book.title}</h2>
                    <p class="author">by ${book.author}</p>
                    <div class="info">
                        <div class="info-item">
                            <div class="info-label">Year</div>
                            <div class="info-value">${book.year}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Genre</div>
                            <div class="info-value">${book.genre}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">ISBN</div>
                            <div class="info-value">${book.isbn}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        bookDetailsDiv.innerHTML = '<p class="error-message">Failed to load book details</p>';
    }
    
    // Load reviews
    await loadReviews(isbn);
    
    // Show review form if user is logged in, otherwise show login prompt
    const reviewFormContainer = document.getElementById('review-form-container');
    const loginPrompt = document.getElementById('login-prompt');
    
    if (currentUser) {
        reviewFormContainer.style.display = 'block';
        loginPrompt.style.display = 'none';
        // Check if user has existing review
        checkExistingReview(isbn);
    } else {
        reviewFormContainer.style.display = 'none';
        loginPrompt.style.display = 'block';
    }
    
    modal.classList.add('show');
}

async function loadReviews(isbn) {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = '<div class="loading">Loading reviews...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/reviews/${encodeURIComponent(isbn)}`);
        const data = await response.json();
        
        if (response.ok && data.reviews && data.reviews.length > 0) {
            reviewsContainer.innerHTML = data.reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-user">👤 ${review.username}</span>
                        <span class="review-rating">⭐ ${review.rating}/5</span>
                    </div>
                    <p class="review-text">${review.review}</p>
                    <p class="review-date">📅 ${new Date(review.date).toLocaleDateString()}</p>
                    ${currentUser && currentUser.username === review.username ? `
                        <div class="review-actions">
                            <button class="btn btn-danger" onclick="deleteReview('${isbn}')">🗑️ Delete My Review</button>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        } else {
            reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. ' + 
                (currentUser ? 'Be the first to review!' : 'Login to add the first review!') + '</p>';
        }
    } catch (error) {
        reviewsContainer.innerHTML = '<p class="no-reviews">No reviews found for this book.</p>';
    }
}

async function checkExistingReview(isbn) {
    try {
        const response = await fetch(`${API_BASE}/reviews/${encodeURIComponent(isbn)}`);
        const data = await response.json();
        
        if (response.ok && data.reviews) {
            const userReview = data.reviews.find(r => r.username === currentUser.username);
            if (userReview) {
                document.getElementById('review-text').value = userReview.review;
                document.getElementById('review-rating').value = userReview.rating;
            } else {
                document.getElementById('review-text').value = '';
                document.getElementById('review-rating').value = '';
            }
        }
    } catch (error) {
        // Ignore error
    }
}

// Task 8: Add/Modify a book review
async function handleReviewSubmit(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showError('Please login to submit a review');
        return;
    }
    
    const review = document.getElementById('review-text').value.trim();
    const rating = parseInt(document.getElementById('review-rating').value);
    
    if (!review || !rating) {
        showError('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/reviews/${encodeURIComponent(currentBookISBN)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ review, rating })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess(data.message || 'Review ' + (data.message && data.message.includes('updated') ? 'updated' : 'added') + ' successfully!');
            // Don't reset if it was an update - keep the form filled
            if (data.message && !data.message.includes('updated')) {
                document.getElementById('review-form').reset();
            }
            await loadReviews(currentBookISBN);
            // Re-check existing review to update form
            checkExistingReview(currentBookISBN);
        } else {
            showError(data.error || 'Failed to submit review');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    }
}

// Task 9: Delete book review
async function deleteReview(isbn) {
    if (!confirm('Are you sure you want to delete your review?')) {
        return;
    }
    
    if (!currentUser) {
        showError('Please login to delete a review');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/reviews/${encodeURIComponent(isbn)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess(data.message || 'Review deleted successfully!');
            await loadReviews(isbn);
        } else {
            showError(data.error || 'Failed to delete review');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    }
}

// ==================== UI HELPERS ====================

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error-message').style.display = 'none';
}

function showSuccess(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.zIndex = '3000';
    successDiv.style.minWidth = '300px';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

