# Bookshop Backend API

A Node.js and Express backend application for managing a bookshop with user authentication and book reviews.

## Features

### General Users (Tasks 1-7)
- **Task 1:** Get the book list available in the shop
- **Task 2:** Get books based on ISBN
- **Task 3:** Get all books by Author
- **Task 4:** Get all books based on Title
- **Task 5:** Get book Review
- **Task 6:** Register New user
- **Task 7:** Login as a Registered user

### Registered Users (Tasks 8-9)
- **Task 8:** Add/Modify a book review
- **Task 9:** Delete book review added by that particular user

### Node.js Program with Async/Await and Promises (Tasks 10-13)
- **Task 10:** Get all books - Using async callback function
- **Task 11:** Search by ISBN - Using Promises
- **Task 12:** Search by Author
- **Task 13:** Search by Title

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Books

- `GET /api/books` - Get all books
- `GET /api/books/isbn/:isbn` - Get book by ISBN
- `GET /api/books/author/:author` - Get books by author
- `GET /api/books/title/:title` - Get books by title

### Users

- `POST /api/users/register` - Register a new user
  ```json
  {
    "username": "john_doe",
    "password": "password123",
    "email": "john@example.com"
  }
  ```

- `POST /api/users/login` - Login as registered user
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```
  Returns a JWT token for authenticated requests.

### Reviews

- `GET /api/reviews/:isbn` - Get reviews for a book
- `POST /api/reviews/:isbn` - Add/Modify a book review (requires authentication)
  ```json
  {
    "review": "Great book!",
    "rating": 5
  }
  ```
  Header: `Authorization: Bearer <token>`

- `DELETE /api/reviews/:isbn` - Delete book review (requires authentication)
  Header: `Authorization: Bearer <token>`

## Node.js Client Program

Run the client program that demonstrates async/await and Promises with Axios:

```bash
node bookClient.js
```

**Note:** Make sure the server is running before executing the client program.

## Testing the API

### Using cURL

1. **Get all books:**
```bash
curl http://localhost:3000/api/books
```

2. **Get book by ISBN:**
```bash
curl http://localhost:3000/api/books/isbn/978-0-123456-78-9
```

3. **Get books by author:**
```bash
curl http://localhost:3000/api/books/author/George%20Orwell
```

4. **Register a user:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","email":"test@example.com"}'
```

5. **Login:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

6. **Add a review (replace TOKEN with actual token):**
```bash
curl -X POST http://localhost:3000/api/reviews/978-0-123456-78-9 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"review":"Excellent book!","rating":5}'
```

### Using Postman or Thunder Client

Import the endpoints and test them using your preferred API testing tool.

## Project Structure

```
.
├── server.js              # Main server file
├── bookClient.js          # Node.js client with async/await and Promises
├── routes/
│   ├── books.js          # Book-related routes
│   ├── users.js          # User authentication routes
│   └── reviews.js        # Review routes
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── data/
│   ├── books.js          # Sample book data
│   ├── users.js          # User storage
│   └── reviews.js        # Review storage
├── package.json
└── README.md
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **axios** - HTTP client for async operations
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Notes

- The application uses in-memory storage for simplicity. In production, replace with a proper database (MongoDB, PostgreSQL, etc.).
- JWT tokens expire after 24 hours.
- All passwords are hashed using bcrypt before storage.
- The client program (`bookClient.js`) demonstrates both async/await and Promises patterns as required.

## License

ISC

