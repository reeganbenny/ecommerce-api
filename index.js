if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json("Server is running");
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log(`Server started on ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
