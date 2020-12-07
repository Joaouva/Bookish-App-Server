const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  ISBN: Number,
  price: Number,
  isUsed: {
    type: Boolean,
    default: false,
  },
  title: String,
  image: String,
  description: String,
  publisher: String,
  published: String,
  author: String,
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
