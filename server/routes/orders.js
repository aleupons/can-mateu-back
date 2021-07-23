const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:orders");
const {
  listOrders,
  showOrder,
  createOrder,
  deleteOrder,
} = require("../../db/controllers/orders");
const { validationErrors, generateError } = require("../errors");
const orderSchema = require("../checkSchemas/orderSchema");
const { duplicateKeyError } = require("../errors");
const { listShoppingCarts } = require("../../db/controllers/shoppingCarts");
const { authorization } = require("../authorization");

const router = express.Router();

router.get("/list", authorization(true), async (req, res, next) => {
  try {
    const ordersList = await listOrders();
    res.json(ordersList);
  } catch (error) {
    next(error);
  }
});

router.get("/my-orders", async (req, res, next) => {
  const { userId: id } = req;
  try {
    const ordersList = await listOrders();
    const myOrders = await ordersList.filter(({ userId }) =>
      userId._id.equals(id)
    );
    console.log(myOrders);
    res.json(myOrders);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/order/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { userId } = req;
    const { id } = req.params;
    try {
      const order = await showOrder(id);
      if (!order.userId.equals(userId)) {
        throw generateError("Accés denegat", 401);
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/new-order", validationErrors, async (req, res, next) => {
  const { userId: id } = req;
  try {
    const shoppingCarts = await listShoppingCarts();
    const shoppingCart = await shoppingCarts.find(({ userId }) =>
      userId._id.equals(id)
    );
    const date = new Date();
    const modifiedOrder = {
      shoppingCartId: shoppingCart._id,
      userId: id,
      date,
    };
    const newOrder = await createOrder(modifiedOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    duplicateKeyError(req, res, next, error);
  }
});

router.delete(
  "/order/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { userId } = req;
    const { id } = req.params;
    try {
      const order = await showOrder(id);
      if (!order.userId.equals(userId)) {
        throw generateError("Accés denegat", 401);
      }
      const deletedOrder = await deleteOrder(id);
      res.json(deletedOrder);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
