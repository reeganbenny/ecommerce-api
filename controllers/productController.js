const Product = require("../models/product");
const Variants = require("../models/variants");
const { validationResult } = require("express-validator");

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      console.log(errors);
      throw error;
    }
    const { name, description, price, variants } = req.body;

    const product = await Product.create({ name, description, price });
    console.log(product._id);
    if (!product) {
      const error = new Error("New product creation failed");
      error.statusCode = 409;
      throw error;
    }
    const productId = product._id;
    if (Array.isArray(variants)) {
      variants.forEach(async (element) => {
        console.log(element);
        const { name, SKU, additionalCost, stockCount } = element;

        //Creating a new Variant
        const newVariant = await Variants.create({
          name,
          SKU,
          additionalCost,
          stockCount,
          productId,
        });

        if (!newVariant) {
          const error = new Error("New variant creation failed");
          error.statusCode = 409;
          throw error;
        }

        // update the product with variantId
        const productUpdate = await Product.updateOne(
          {
            _id: productId,
          },
          {
            $addToSet: { variants: newVariant._id },
          }
        );

        if (!productUpdate) {
          const error = new Error("product update failed");
          error.statusCode = 409;
          throw error;
        }
      });
    }

    res.status(200).json("Product created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("variants");
    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(product);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const product = await Product.find().populate("variants");
    if (!product) {
      const error = new Error("Product Schema is empty");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(product);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      console.log(errors);
      throw error;
    }
    const { name, description, price } = req.body;
    const updatedProduct = await Product.updateOne(
      { _id: productId },
      {
        $set: {
          name: name,
          description: description,
          price: price,
        },
      }
    );
    if (updatedProduct) {
      if (updatedProduct.modifiedCount == 1)
        res.status(200).json("Product updated susccessfully");
      else {
        const error = new Error("Product updated failed...");
        error.statusCode = 404;
        throw error;
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productResult = await Product.findByIdAndDelete(productId);
    if (productResult) {
      const variantsIds = productResult.variants;
      const variantResult = await Variants.deleteMany({
        _id: { $in: variantsIds },
      });
    }
    res.status(200).json("Product deleted successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { val } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: new RegExp(val, "i") } },
        { description: { $regex: new RegExp(val, "i") } },
      ],
    }).populate({
      path: "variants",
      match: { name: { $regex: new RegExp(val, "i") } }, // Variant name search
    });
    res.status(200).json(products);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
