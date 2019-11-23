const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const User = require("../MODELS/model_user");
const Offer = require("../MODELS/model_offer");

router.post("/offer/publish", async (req, res) => {
  const tokenTab = req.headers.authorization.split(" ");
  let token = tokenTab[1];
  console.log("token", token);

  const foundUser = await User.findOne({ token: token });
  console.log("foundUser", foundUser);

  try {
    const newOffer = new Offer({
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      creator: foundUser._id
    });
    await newOffer.save();

    res.json(newOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// router.get("/offer/publish", async (req, res) => {
//   try {
//     const readMyOffer = await Offer.find().populate("creator");
//     res.json(readMyOffer);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;
