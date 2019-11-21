const express = require("express");
const mongoose = require("mongoose");
const formidableMiddleware = require("express-formidable");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

//
// test

app.listen(4000, () => {
  console.log("server started");
});
