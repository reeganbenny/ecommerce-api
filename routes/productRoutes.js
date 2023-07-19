const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const createProductValidator = require("../utils/validators");

// Product routes
router.post(
  "/",
  createProductValidator.createProductValidator,
  productController.createProduct
);
router.get("/:id", productController.getProductById);
router.get("/", productController.getAllProducts);
router.put(
  "/:id",
  createProductValidator.updateProductValidator,
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
