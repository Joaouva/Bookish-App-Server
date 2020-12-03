const axios = require("axios");
const express = require("express");
const router = express.Router();
const Book = require("../models/book-model");
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
        const image = book.image_url[0];
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
module.exports = router;
