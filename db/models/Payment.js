const { Schema, model } = require("mongoose");
const Order = require("./Order");

const PaymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    bank: {
      type: String,
      required: true,
      unique: true,
    },
    account: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { versionKey: false }
);

const Payment = model("Payment", PaymentSchema, "payments");

module.exports = Payment;
