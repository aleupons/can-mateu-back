const { Schema, model } = require("mongoose");
const User = require("./User");
const ShoppingCart = require("./ShoppingCart");

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shoppingCartId: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingCart",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

const Order = model("Order", OrderSchema, "orders");

module.exports = Order;
