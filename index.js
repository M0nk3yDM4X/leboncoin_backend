require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");

const app = express();
app.use(cors());
app.use(formidableMiddleware());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require("./MODELS/model_user");
require("./MODELS/model_offer");

const roadUser = require("./ROADS/road_user");
app.use(roadUser);

const roadOffer = require("./ROADS/road_offer");
app.use(roadOffer);

app.listen(process.env.PORT, () => {
  console.log("server started");
});
