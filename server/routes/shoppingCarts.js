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
const { showBasket } = require("../../db/controllers/baskets");
const { validationErrors } = require("../errors");
const {
  shoppingCartSchema,
  shoppingCartProductSchema,
} = require("../checkSchemas/shoppingCartSchema");
const { generateError, duplicateKeyError } = require("../errors");
const { getToken, authorization } = require("../authorization");

const router = express.Router();

router.get("/list", authorization(false), async (req, res, next) => {
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
  "/shopping-cart/add/:productId",
  check("productId", "Id incorrecta").isMongoId(),
  checkSchema(shoppingCartProductSchema),
  validationErrors,
  getToken(),
  async (req, res, next) => {
    const { userId } = req;
    const { productId } = req.params;
    const { amount, isBasket } = req.body;
    try {
      const shoppingCarts = await listShoppingCarts();
      const shoppingCart = await shoppingCarts.find((existShoppingCart) =>
        existShoppingCart.userId._id.equals(userId)
      );
      if (shoppingCart) {
        let basket = {};
        let product = {};
        if (!isBasket) {
          product = await showProduct(productId);
        } else if (isBasket) {
          basket = await showBasket(productId);
        }
        if (product || basket) {
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
          throw generateError("Aquest producte o cistella no existeix", 400);
        }
      } else {
        throw generateError("Aquest usuari no té cap carro", 400);
      }
      const modifiedShoppingCart = await modifyShoppingCart(
        shoppingCart._id,
        shoppingCart
      );
      res.json(modifiedShoppingCart);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.put(
  "/shopping-cart/remove/:productId",
  check("productId", "Id incorrecta").isMongoId(),
  validationErrors,
  getToken(),
  async (req, res, next) => {
    const { userId } = req;
    const { productId } = req.params;
    try {
      const shoppingCarts = await listShoppingCarts();
      const shoppingCart = await shoppingCarts.find((existShoppingCart) =>
        existShoppingCart.userId._id.equals(userId)
      );
      if (shoppingCart) {
        const product = await showProduct(productId);
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
        throw generateError("Aquest usuari no té cap carro", 400);
      }
      const modifiedShoppingCart = await modifyShoppingCart(
        shoppingCart._id,
        shoppingCart
      );
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
