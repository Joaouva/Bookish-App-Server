const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    Title: String,
    Author: String,
    Publisher: String,
    Published: Date,
    ISBN: Number,
    Description: String,
    Language: String,
    Image: String,
    Price: Number,
    Grade: {
            type: String,
            enum: ['A', 'B', 'C'],
        }
  }  
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book
