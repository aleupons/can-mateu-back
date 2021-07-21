const { Schema, model } = require("mongoose");
const User = require("./User");
const Product = require("./Product");

const ShoppingCartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
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
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { versionKey: false }
);

const ShoppingCart = model("ShoppingCart", ShoppingCartSchema, "shoppingCarts");

module.exports = ShoppingCart;
