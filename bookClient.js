const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/books';

// Task 10: Get all books - Using async callback function
// Provide a Node-style callback version: callback(err, data)
function getAllBooksCallback(callback) {
  console.log('\n=== Task 10: Get all books (using callback) ===');
  axios.get(`${BASE_URL}/`)
    .then(response => {
      console.log(`Total books: ${response.data.count}`);
      console.log('Books:', JSON.stringify(response.data.books, null, 2));
      callback(null, response.data);
    })
    .catch(error => {
      console.error('Error fetching all books (callback):', error.message);
      callback(error);
    });
}

// Also keep an async/await version (useful for other callers/tests)
async function getAllBooks() {
  try {
    console.log('\n=== Task 10: Get all books (using async/await) ===');
    const response = await axios.get(`${BASE_URL}/`);
    console.log(`Total books: ${response.data.count}`);
    console.log('Books:', JSON.stringify(response.data.books, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching all books:', error.message);
    throw error;
  }
}

// Task 11: Search by ISBN - Using Promises
function searchByISBN(isbn) {
  console.log('\n=== Task 11: Search by ISBN (using Promises) ===');
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then(response => {
      console.log(`Book found for ISBN ${isbn}:`);
      console.log(JSON.stringify(response.data.book, null, 2));
      return response.data;
    })
    .catch(error => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
      throw error;
    });
}

// Task 12: Search by Author
async function searchByAuthor(author) {
  try {
    console.log('\n=== Task 12: Search by Author (using async/await) ===');
    const encodedAuthor = encodeURIComponent(author);
    const response = await axios.get(`${BASE_URL}/author/${encodedAuthor}`);
    console.log(`Found ${response.data.count} book(s) by ${author}:`);
    console.log(JSON.stringify(response.data.books, null, 2));
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
    throw error;
  }
}

// Task 13: Search by Title
function searchByTitle(title) {
  console.log('\n=== Task 13: Search by Title (using Promises) ===');
  const encodedTitle = encodeURIComponent(title);
  return axios.get(`${BASE_URL}/title/${encodedTitle}`)
    .then(response => {
      console.log(`Found ${response.data.count} book(s) with title "${title}":`);
      console.log(JSON.stringify(response.data.books, null, 2));
      return response.data;
    })
    .catch(error => {
      console.error(`Error fetching books with title ${title}:`, error.message);
      throw error;
    });
}

// Main function to demonstrate all methods
async function main() {
  console.log('========================================');
  console.log('Node.js Book Client Program');
  console.log('Using Async/Await and Promises with Axios');
  console.log('========================================');

  try {
    // Task 10: Get all books (callback style)
    await new Promise((resolve, reject) => {
      getAllBooksCallback((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    // Task 11: Search by ISBN (Promises)
    await searchByISBN('978-0-123456-78-9');

    // Task 12: Search by Author (async/await)
    await searchByAuthor('George Orwell');

    // Task 13: Search by Title (Promises)
    await searchByTitle('The');

    console.log('\n========================================');
    console.log('All tasks completed successfully!');
    console.log('========================================');
  } catch (error) {
    console.error('\nError in main execution:', error.message);
  }
}

// Run the program if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  getAllBooks,
  searchByISBN,
  searchByAuthor,
  searchByTitle
};

