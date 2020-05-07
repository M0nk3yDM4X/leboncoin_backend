const User = require("../MODELS/model_user");
const Offer = require("../MODELS/model_offer");

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CREATE

exports.createOffer = async (req, res) => {
  const tokenTab = req.headers.authorization.split(" ");
  let token = tokenTab[1];
  // console.log("token", token);

  const foundUser = await User.findOne({ token: token });
  // console.log(foundUser._id);
  // console.log(req.files);

  let file = {};
  const fileKeys = Object.keys(req.files);
  for (let i = 0; i < fileKeys.length; i++) {
    file = req.files[fileKeys];
  }

  cloudinary.v2.uploader.upload(file.path, async (error, result) => {
    if (error) {
      const newOffer = new Offer({
        title: req.fields.title,
        description: req.fields.description,
        price: req.fields.price,
        creator: foundUser._id,
        created: new Date()
      });
      await newOffer.save();

      res.json(newOffer);
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
};

// READ;

const createFilters = req => {
  const filters = {};

  if (req.query.priceMin) {
    filters.price = {};
    filters.price.$gte = req.query.priceMin;
  }
  if (req.query.priceMax) {
    if (filters.price === undefined) {
      filters.price = {};
    }
    filters.price.$lte = req.query.priceMax;
  }

  if (req.query.title) {
    filters.title = new RegExp(req.query.title, "i");
  }
  return filters;
};

// 1. READ-ALL

exports.readAll = async (req, res) => {
  try {
    const sort = req.query.sort;
    let list = {};

    const filters = createFilters(req);

    let search = Offer.find(filters).populate("creator");
    let length = Offer.find(filters);

    if (sort) {
      if (sort === "prix-croissant") {
        // search.sort((a, b) => (a.price > b.price ? 1 : -1));
        search.sort({ price: 1 });
      } else if (sort === "prix-décroissant") {
        search.sort({ price: -1 });
      } else if (sort === "date-décroissant") {
        search.sort({ created: -1 });
      } else if (sort === "date-croissant") {
        search.sort({ created: 1 });
      }
    }

    if (req.query.page) {
      const page = req.query.page;
      const limit = 3;

      search.limit(limit).skip(limit * (page - 1));
    }

    const offers = await search;

    list.offers = offers;

    const data = await length;

    list.count = data.length;

    res.json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. READ-ONE

exports.readOne = async (req, res) => {
  try {
    const id = req.params.id;
    const searchOffer = await Offer.findById(id).populate("creator");

    res.json(searchOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
