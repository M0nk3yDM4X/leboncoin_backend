const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  token: String,
  account: { username: String },
  hash: String,
  salt: String
});

module.exports = User;
