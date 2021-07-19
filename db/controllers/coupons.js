const Coupon = require("../models/Coupon");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Coupon;
const modelName = "cupó";

const listCoupons = async () => list(model, modelName);
const showCoupon = async (couponId) => read(couponId, model, modelName);
const createCoupon = async (newCoupon) => create(newCoupon, model, modelName);
const modifyCoupon = async (couponId, modifiedCoupon) =>
  update(couponId, modifiedCoupon, model, modelName);
const deleteCoupon = async (couponId) => deleteData(couponId, model, modelName);

module.exports = {
  listCoupons,
  showCoupon,
  createCoupon,
  modifyCoupon,
  deleteCoupon,
};
