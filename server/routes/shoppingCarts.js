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
const { showProduct } = require("../../db/controllers/products");
const { validationErrors } = require("../errors");
const {
  shoppingCartSchema,
  shoppingCartProductSchema,
} = require("../checkSchemas/shoppingCartSchema");
const { generateError, duplicateKeyError } = require("../errors");

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

router.post(
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

/* AFEGIR I TREURE PRODUCTES DEL CARRO */

router.put(
  "/shopping-cart/add/:id",
  check("id", "Id incorrecta").isMongoId(),
  checkSchema(shoppingCartProductSchema),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const { productId, amount } = req.body;
    try {
      const shoppingCart = await showShoppingCart(id);
      if (await showProduct(productId)) {
        shoppingCart.products.push({ productId, amount });
      } else {
        throw generateError("Aquest producte no existeix", 400);
      }
      const modifiedShoppingCart = await modifyShoppingCart(id, shoppingCart);
      res.json(modifiedShoppingCart);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.put(
  "/shopping-cart/remove/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const { _id: objectId } = req.body;
    try {
      const shoppingCart = await showShoppingCart(id);
      shoppingCart.products = shoppingCart.products.filter(
        (product) => product._id !== objectId
      );
      const modifiedShoppingCart = await modifyShoppingCart(id, shoppingCart);
      res.json(modifiedShoppingCart);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

/* */

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
