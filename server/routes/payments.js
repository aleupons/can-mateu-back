const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:payments");
const {
  listPayments,
  showPayment,
  createPayment,
} = require("../../db/controllers/payments");
const { validationErrors, generateError } = require("../errors");
const paymentSchema = require("../checkSchemas/paymentSchema");
const { duplicateKeyError } = require("../errors");
const { authorization } = require("../authorization");

const router = express.Router();

router.get("/list", authorization(true), async (req, res, next) => {
  try {
    const paymentsList = await listPayments();
    res.json(paymentsList);
  } catch (error) {
    next(error);
  }
});

router.get("/my-payments", authorization(false), async (req, res, next) => {
  const { userId } = req;
  try {
    const paymentsList = await listPayments();
    const myPayments = await paymentsList.filter((payment) =>
      payment.orderId.userId._id.equals(userId)
    );
    res.json(myPayments);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/payment/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { userId } = req;
    const { id } = req.params;
    try {
      const payment = await showPayment(id);
      if (!payment.orderId.userId._id.equals(userId)) {
        throw generateError("Accés denegat", 401);
      }
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/new-payment",
  checkSchema(paymentSchema),
  validationErrors,
  async (req, res, next) => {
    const { userId } = req;
    const payment = req.body;
    try {
      if (!payment.orderId.userId._id.equals(userId)) {
        throw generateError("Accés denegat", 401);
      }
      const newPayment = await createPayment(payment);
      res.status(201).json(newPayment);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

module.exports = router;
