const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { type: String },
  token: { type: String, select: false },
  account: { username: String },
  hash: { type: String, select: false },
  salt: { type: String, select: false }
});

module.exports = User;
