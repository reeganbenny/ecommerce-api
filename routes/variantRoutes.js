const express = require("express");
const router = express.Router();
const variantController = require("../controllers/variantController");
const createVariantValidator = require("../utils/validators");

// Variant routes
router.post(
  "/:id",
  createVariantValidator.createVariantValidator,
  variantController.createVariant
);
router.get("/:id", variantController.getVariantById);
router.put(
  "/:id",
  createVariantValidator.updateVariantValidator,
  variantController.updateVariant
);
router.delete("/:id", variantController.deleteVariant);

module.exports = router;
