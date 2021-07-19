const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shoppingCardId: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingCard",
      required: true,
      unique: true,
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
