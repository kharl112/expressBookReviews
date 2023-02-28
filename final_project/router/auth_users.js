const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const [userFound] = users.filter(({ username: _username }) => _username === username);
  return !!userFound;
}

const authenticatedUser = (username, password) => {
  const [userFound] = users.filter(({ username: _username }) => _username === username);
  return userFound && userFound.password === password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(402).send("username / password must be provided");
  if (!isValid(username)) return res.status(402).send("user does not exists");
  if (!authenticatedUser(username, password)) return res.status(403).send("password is invalid");

  const token = jwt.sign({ username }, 'fingerprint_customer');
  req.session.user = { token, username };

  res.send("logged in successfully");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body
  const { isbn } = req.params;
  const { username } = req.user;

  const book = books[isbn];
  if (!book) return res.status(404).send("book not found")

  book.reviews[username] = review;

  res.send("review sent");
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;

  const book = books[isbn];
  if (!book) return res.status(404).send("book not found")

  delete books[isbn].reviews[username];
  res.send("review deleted");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
