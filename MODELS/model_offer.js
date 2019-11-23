const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: String,
  description: String,
  price: Number,
  pictures: [],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  created: { type: Date, default: new Date() }
});

module.exports = Offer;
