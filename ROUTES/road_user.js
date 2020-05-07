const express = require("express");
const router = express.Router();

const userCtrl = require("../Controllers/user.js");

// CREATE

router.post("/user/sign_up", userCtrl.signup);

router.post("/user/log_in", userCtrl.signIn);

router.get("/users", userCtrl.readAll);

module.exports = router;
