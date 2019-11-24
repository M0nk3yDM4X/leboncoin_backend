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
  // console.log("token", token);

  const foundUser = await User.findOne({ token: token });
  console.log(foundUser._id);
  // console.log(req.files);

  let file = {};
  const fileKeys = Object.keys(req.files);
  for (let i = 0; i < fileKeys.length; i++) {
    file = req.files[fileKeys];
  }

  cloudinary.v2.uploader.upload(file.path, async (error, result) => {
    if (error) {
      console.log("error");
    } else {
      try {
        const newOffer = new Offer({
          title: req.fields.title,
          description: req.fields.description,
          price: req.fields.price,
          creator: foundUser._id,
          pictures: result.secure_url,
          created: new Date()
        });
        await newOffer.save();

        res.json(newOffer);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  });
});

router.get("/offer/with-count", async (req, res) => {
  try {
    const list = {};

    const search = await Offer.find().populate("creator");

    list.count = search.length;
    list.offers = await search;
    res.json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/offer/", async (req, res) => {
  let id = req.query.id;
  try {
    const searchOffer = await Offer.findById(id).populate("creator");
    console.log(searchOffer);

    res.json(searchOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
