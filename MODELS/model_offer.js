const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: String,
  description: String,
  price: Number,
  created: { type: Date, default: new Date() },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = Offer;
