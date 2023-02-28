const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(402).send("username / password must be provided");

  if (isValid(username)) return res.status(402).send("user already exists");

  users.push({ username, password });
  res.send("user registered");
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) return res.status(404).send("book not found")
  res.send(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;

  const [book] = books.filter(({ author: _author }) => _author.toLowerCase() === author.toLowerCase());
  if (!book) return res.status(404).send("book not found");

  res.send(book);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;

  const [book] = books.filter(({ title: _title }) => _title.toLowerCase() === title.toLowerCase());
  if (!book) return res.status(404).send("book not found");

  res.send(book);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) return res.status(404).send("book not found")
  return res.send(book.reviews);
});

module.exports.general = public_users;
