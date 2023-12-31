const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "variants",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
