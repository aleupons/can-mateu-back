const { Schema, model } = require("mongoose");
const User = require("./User");
const Product = require("./Product");

const ShoppingCartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { versionKey: false }
);

const ShoppingCart = model(
  "ShoppingCart",
  ShoppingCartSchema,
  "shopping-carts"
);

module.exports = ShoppingCart;
