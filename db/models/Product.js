const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    photoUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    discount: Number,
    date: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

const Product = model("Product", ProductSchema, "products");

module.exports = Product;
