const express = require("express");
const router = express.Router();

const offerCtrl = require("../Controllers/offer.js");

// CREATE

router.post("/offer/publish", offerCtrl.createOffer);

// 1. READ-ALL

router.get("/offers", offerCtrl.readAll);

// 2. READ-ONE

router.get("/offer/:id", offerCtrl.readOne);

module.exports = router;
