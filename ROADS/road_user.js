const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../MODELS/model_user");
const Offer = require("../MODELS/model_offer");

router.post("/user/sign_up", async (req, res) => {
  const token = uid2(64);
  const salt = uid2(64);
  const hash = SHA256(req.fields.password + salt).toString(encBase64);
  let email = req.fields.email;
  let username = req.fields.username;

  try {
    const newUser = new User({
      email: email,
      token: token,
      salt: salt,
      hash: hash,
      account: {
        username: username
      }
    });

    await newUser.save();
    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account
    });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

router.post("/user/log_in", async (req, res) => {
  const findUser = await User.findOne({ email: req.fields.email });
  try {
    if (findUser) {
      if (
        SHA256(req.fields.password + findUser.salt).toString(encBase64) ===
        findUser.hash
      ) {
        return res.json({
          _id: findUser._id,
          token: findUser.token,
          account: findUser.account
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.json({ error: "User not found" });
    }
  } catch (error) {
    console.log("errorrrrrrr");
  }
});

module.exports = router;
