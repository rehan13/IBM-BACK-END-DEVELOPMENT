const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

const getBooksList = () => {
    return new Promise((resolve, reject) => {
      axios.get('URL_TO_GET_BOOKS_LIST')
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  
 
public_users.get('/', async (req, res) => {
    try {
      const booksList = await getBooksList();
      res.send(JSON.stringify(booksList, null, 4));
    } catch (error) {
      res.status(500).json({ message: "Error fetching books list" });
    }
});

const getBookDetailsByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      axios.get(`URL_TO_GET_BOOK_BY_ISBN/${isbn}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
};
  

public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const bookDetails = await getBookDetailsByISBN(isbn);
      res.send(JSON.stringify(bookDetails, null, 4));
    } catch (error) {
      res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});
  
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      axios.get(`URL_TO_GET_BOOKS_BY_AUTHOR/${author}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
};

public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const booksByAuthor = await getBooksByAuthor(author);
      res.send(JSON.stringify(booksByAuthor, null, 4));
    } catch (error) {
      res.status(404).json({ message: `Books by author '${author}' not found` });
    }
});


// Get all books based on title
const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      axios.get(`URL_TO_GET_BOOKS_BY_TITLE/${title}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  
  // Route handler for getting book details based on Title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
      const booksByTitle = await getBooksByTitle(title);
      res.send(JSON.stringify(booksByTitle, null, 4));
    } catch (error) {
      res.status(404).json({ message: `Books with title '${title}' not found` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book with the specified ISBN exists in the 'books' object
    if (books[isbn]) {
      const bookReviews = books[isbn].reviews;
  
      // Check if there are reviews for the book
      if (Object.keys(bookReviews).length > 0) {
        res.json(bookReviews);
      } else {
        res.status(404).json({ message: "No reviews found for this book" });
      }
    } else {
      res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
