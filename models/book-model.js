const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  ISBN: Number,
  price: Number,
  grade: {
    type: String,
    enum: ["A", "B", "C"],
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
