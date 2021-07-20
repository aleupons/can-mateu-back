const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:coupons");
const {
  listCoupons,
  createCoupon,
  deleteCoupon,
} = require("../../db/controllers/coupons");
const { validationErrors } = require("../errors");
const couponSchema = require("../checkSchemas/couponSchema");
const { duplicateKeyError } = require("../errors");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const couponsList = await listCoupons();
    res.json(couponsList);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/new-coupon",
  checkSchema(couponSchema),
  validationErrors,
  async (req, res, next) => {
    const coupon = req.body;
    try {
      const newCoupon = await createCoupon(coupon);
      res.status(201).json(newCoupon);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.delete(
  "/coupon/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const coupon = await deleteCoupon(id);
      res.json(coupon);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
