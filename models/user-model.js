const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    name: String,
    about: String,
    password: String,
    email: String,
    city: String,
    isCompany: {
      type: Boolean,
      default: false,
    },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
