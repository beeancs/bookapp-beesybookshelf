const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - allows requests from localhost and GitHub Pages
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            /^https:\/\/.*\.github\.io$/, // Allow all GitHub Pages domains
        ];
        
        // Check if origin matches any allowed pattern
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') {
                return origin === allowed;
            } else if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            // For development, allow all origins (remove in production if needed)
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// API Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Bookshop Backend API',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      users: '/api/users',
      reviews: '/api/reviews'
    }
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

