const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:shopping-carts");
const {
  listShoppingCarts,
  showShoppingCart,
  createShoppingCart,
  modifyShoppingCart,
  deleteShoppingCart,
} = require("../../db/controllers/shoppingCarts");
const { validationErrors } = require("../errors");
const shoppingCartSchema = require("../checkSchemas/shoppingCartSchema");
const { duplicateKeyError } = require("../errors");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const shoppingCartsList = await listShoppingCarts();
    res.json(shoppingCartsList);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/shopping-cart/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const shoppingCart = await showShoppingCart(id);
      res.json(shoppingCart);
    } catch (error) {
      next(error);
    }
  }
);

/* AFEGIR O TREURE PRODUCTES DEL CARRO */

/* router.post(
  "/new-shopping-cart",
  checkSchema(shoppingCartSchema),
  validationErrors,
  async (req, res, next) => {
    const shoppingCart = req.body;
    try {
      const newShoppingCart = await createShoppingCart(shoppingCart);
      res.status(201).json(newShoppingCart);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.put(
  "/shopping-cart/:id",
  check("id", "Id incorrecta").isMongoId(),
  checkSchema(shoppingCartSchema),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const shoppingCart = req.body;
    try {
      const modifiedShoppingCart = await modifyShoppingCart(id, shoppingCart);
      res.json(modifiedShoppingCart);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
); */

router.delete(
  "/shopping-cart/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const shoppingCart = await deleteShoppingCart(id);
      res.json(shoppingCart);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
