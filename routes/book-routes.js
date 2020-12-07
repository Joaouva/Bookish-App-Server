const axios = require("axios");
const express = require("express");
const router = express.Router();
const Book = require("../models/book-model");
const User = require("../models/user-model");
const parseString = require("xml2js").parseString;

// const goodreadsAPI = axios.create({
//  baseURL: `https://www.goodreads.com/search.xml?key=${process.env.GOODREADS_API_KEY}`,
// });

//get book by ISBN
router.get("/books/:isbn", (req, res) => {
  axios
    .get(
      `https://www.goodreads.com/book/isbn/${req.params.isbn}?key=${process.env.GOODREADS_API_KEY}`
    )
    .then((response) => {
      parseString(response.data, (err, result) => {
        console.log("result", result.GoodreadsResponse.book[0]);
        const book = result.GoodreadsResponse.book[0];
        const title = book.title[0];
        const description = book.description[0];
        const author = book.authors[0].author[0].name[0];
        const publisher = book.publisher[0];
        const isbn = book.isbn13[0];
        const image = book.image_url[0].replace("SX98", "SX500");
        const published = book.publication_year[0];
        const language = book.language_code[0];

        res.json({
          title,
          description,
          author,
          publisher,
          isbn,
          image,
          published,
          language,
        });
      });
    });
});

router.get("/books/:isbn/details", (req, res) => {
  const isbn = req.params.isbn;
  Book.find({ ISBN: isbn }).then((book) => {
    res.json(book);
  });
});

// get book by title
/* router.get("/books/:title", (req, res) => {
  let searchTitle = req.params.title;
  let title = searchTitle.replace(" ", "+");

  axios
    .get(
      `https://www.goodreads.com/search.xml?key=${process.env.GOODREADS_API_KEY}&q=${title}`
    )
    .then((bookTitle) => {
      res.json(bookTitle);
    });
});
*/

//:id is the is of the book
router.post("/books/associate", (req, res) => {
  const loggedUserId = req.user._id;
  const {
    isbn,
    price,
    grade,
    title,
    description,
    author,
    publisher,
    published,
    image,
    language,
    isUsed,
  } = req.body;
  console.log("looggedUSerId", loggedUserId);

  Book.create({
    ISBN: isbn,
    price,
    title: title,
    decription: description,
    author: author,
    publisher: publisher,
    published: published,
    image: image,
    language: language,
    isUsed,
  }).then((response) => {
    User.findByIdAndUpdate(loggedUserId, {
      $push: { books: response._id },
    }).then(() => {
      res.json({
        message: `Book with id ${response._id} was added to user ${loggedUserId}`,
      });
    });
  });
});

// route para todos os livros da NOSSA base de dados
router.get("/books/db/allbooks", (req, res) => {
  Book.find().then((allBooksFromDb) => {
    console.log(allBooksFromDb);
    res.json(allBooksFromDb);
  });
});

router.get("/books/db/allbookshops", (req, res) => {
  User.find().then((users) => {
    const onlyUsersWithBooks = users.filter((user) => {
      return user.books.length > 0;
    });
    res.json(onlyUsersWithBooks);
  });
});

router.get("/books/db/allbookshops/:id", (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .populate("books")
    .then((userDetails) => {
      res.json(userDetails);
    });
});

module.exports = router;
