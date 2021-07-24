const { Schema, model } = require("mongoose");
const User = require("./User");
const Product = require("./Product");
const { showProduct } = require("../controllers/products");

const ShoppingCartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    products: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            refPath: "Product",
            required: true,
          },
          basketId: {
            type: Schema.Types.ObjectId,
            refPath: "Basket",
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            default: 0,
            required: true,
          },
          isBasket: {
            type: Boolean,
            required: true,
          },
        },
      ],
      default: [],
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
