const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const variantsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
    },
    additionalCost: {
      type: Number,
      required: true,
    },
    stockCount: {
      type: Number,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("variants", variantsSchema);
