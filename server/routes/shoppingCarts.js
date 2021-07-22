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
const { authorization } = require("../authorization");

const router = express.Router();

router.get("/list", authorization, async (req, res, next) => {
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
      const product = await showProduct(productId);
      if (product) {
        // Si existeix el producte que ens passen
        const productToModify = shoppingCart.products.find((existsProduct) =>
          existsProduct.productId._id.equals(productId)
        );
        if (productToModify) {
          // Si el carro ja té el producte
          const products = shoppingCart.products.map((productToQuantify) => {
            if (productToQuantify.productId._id.equals(productId)) {
              productToQuantify.amount = amount;
            }
            return productToQuantify;
          });
          shoppingCart.products = products;
          // shoppingCart.price PREU TOTAL (per BBDD, per back o per front?)
        } else {
          // Si el carro no té el producte
          shoppingCart.products.push({ productId, amount });
          // shoppingCart.price PREU TOTAL (per BBDD, per back o per front?)
        }
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
    const { productId } = req.body;
    try {
      const shoppingCart = await showShoppingCart(id);
      const product = await showProduct(productId);
      if (product) {
        if (
          shoppingCart.products.find((existsProduct) =>
            existsProduct.productId._id.equals(productId)
          )
        ) {
          shoppingCart.products = shoppingCart.products.filter(
            (product) => !product.productId._id.equals(productId)
          );
        } else {
          throw generateError("Aquest producte no està al carro", 400);
        }
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
