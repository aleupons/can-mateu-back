const { Schema, model } = require("mongoose");

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { versionKey: false }
);

const Coupon = model("Coupon", CouponSchema, "coupons");

module.exports = Coupon;
