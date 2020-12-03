const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  about: String,
  password: String,
  email: String,
  city: String,
  isCompany: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema);
module.exports = User;
  