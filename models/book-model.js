const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: String,
  publisher: String,
  published: Date,
  ISBN: Number,
  description: String,
  language: String,
  image: String,
  price: Number,
  grade: {
    type: String,
    enum: ["A", "B", "C"],
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
