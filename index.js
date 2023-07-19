if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

const productRoutes = require("./routes/productRoutes");

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/products", productRoutes);
app.use("/variants", productRoutes);

app.get("/", (req, res) => {
  res.status(200).json("Server is running");
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  console.log(status);
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
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
