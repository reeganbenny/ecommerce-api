const { check } = require("express-validator");

exports.createProductValidator = [
  check("name").trim().notEmpty().withMessage("Name is required"),
  check("description").trim().notEmpty().withMessage("Description is required"),
  check("price").trim().isNumeric().notEmpty().withMessage("price is required"),
  check("variants")
    .optional({ nullable: true })
    .isArray()
    .withMessage("Variants must be an array"),
  check("variants.*")
    .optional({ nullable: true })
    .isObject()
    .withMessage("Variant should be an object"),
];

exports.updateProductValidator = [
  check("name")
    .trim()
    .notEmpty()
    .optional({ nullable: true })
    .withMessage("Name is required"),
  check("description")
    .trim()
    .notEmpty()
    .optional({ nullable: true })
    .withMessage("Description is required"),
  check("price")
    .trim()
    .isNumeric()
    .notEmpty()
    .optional({ nullable: true })
    .withMessage("price is required"),
];

exports.createVariantValidator = [
  check("name").trim().notEmpty().withMessage("Name is required"),
  check("SKU").trim().notEmpty().withMessage("Description is required"),
  check("additionalCost")
    .trim()
    .isNumeric()
    .notEmpty()
    .withMessage("price is required"),
  check("stockCount")
    .trim()
    .isNumeric()
    .notEmpty()
    .withMessage("price is required"),
];

exports.updateVariantValidator = [
  check("name")
    .trim()
    .notEmpty()
    .optional({ nullable: true })
    .withMessage("Name is required"),
  check("SKU")
    .trim()
    .notEmpty()
    .optional({ nullable: true })
    .withMessage("Description is required"),
  check("additionalCost")
    .trim()
    .isNumeric()
    .notEmpty()
    .optional({ nullable: true })
    .withMessage("price is required"),
  check("stockCount")
    .trim()
    .isNumeric()
    .notEmpty()
    .optional({ nullable: true })
    .withMessage("price is required"),
];
