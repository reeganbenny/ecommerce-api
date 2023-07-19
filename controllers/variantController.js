const Product = require("../models/product");
const Variants = require("../models/variants");
const { validationResult } = require("express-validator");

exports.createVariant = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      console.log(errors);
      throw error;
    }

    const { name, SKU, additionalCost, stockCount } = req.body;
    const productId = req.params.id;
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

    res.status(200).json("New variant created successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getVariantById = async (req, res, next) => {
  try {
    const variantId = req.params.id;
    const variant = await Variants.findById(variantId).populate("productId");
    if (!variant) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(variant);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateVariant = async (req, res, next) => {
  try {
    const variantId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      console.log(errors);
      throw error;
    }
    const { name, SKU, additionalCost, stockCount } = req.body;
    const updatedVarinat = await Variants.updateOne(
      { _id: variantId },
      {
        $set: {
          name: name,
          SKU: SKU,
          additionalCost: additionalCost,
          stockCount: stockCount,
        },
      }
    );
    if (updatedVarinat) {
      if (updatedVarinat.modifiedCount == 1)
        res.status(200).json("Varinat updated susccessfully");
      else {
        const error = new Error("Variant updated failed...");
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

exports.deleteVariant = async (req, res, next) => {
  try {
    const variantId = req.params.id;
    const variantResult = await Variants.findByIdAndDelete(variantId);
    console.log(variantResult);
    if (variantResult) {
      const productId = variantResult.productId;
      const productResult = await Product.findOneAndUpdate(
        {
          _id: productId,
        },
        { $pull: { variants: variantId } },
        { new: true }
      );
    }
    res.status(200).json("Variant deleted successfully");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
