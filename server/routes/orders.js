const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:orders");
const {
  listOrders,
  showOrder,
  createOrder,
  deleteOrder,
} = require("../../db/controllers/orders");
const { validationErrors } = require("../errors");
const orderSchema = require("../checkSchemas/orderSchema");
const { duplicateKeyError } = require("../errors");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const ordersList = await listOrders();
    res.json(ordersList);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/order/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const order = await showOrder(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/new-order",
  checkSchema(orderSchema),
  validationErrors,
  async (req, res, next) => {
    const order = req.body;
    try {
      const newOrder = await createOrder(order);
      res.status(201).json(newOrder);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.delete(
  "/order/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const order = await deleteOrder(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
