const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:shopping-carts");
const { LocalStorage } = require("node-localstorage");
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

const localStorage = new LocalStorage("./scratch");

const router = express.Router();

router.get("/list", authorization(true), async (req, res, next) => {
  try {
    const shoppingCartsList = await listShoppingCarts();
    res.json(shoppingCartsList);
  } catch (error) {
    next(error);
  }
});

router.get("/shopping-cart", getToken(), async (req, res, next) => {
  const { userId: id } = req;
  try {
    if (!id) {
      const shoppingCartId = localStorage.getItem("shoppingCartId");
      const shoppingCart = await showShoppingCart(shoppingCartId);
      return res.json(shoppingCart);
    }
    const shoppingCarts = await listShoppingCarts();
    const shoppingCart = await shoppingCarts.find(({ userId }) =>
      userId._id.equals(id)
    );
    res.json(shoppingCart);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/new-shopping-cart",
  checkSchema(shoppingCartSchema),
  validationErrors,
  getToken(),
  async (req, res, next) => {
    const { userId } = req;
    try {
      const newShoppingCart = await createShoppingCart({
        userId: userId || undefined,
      });
      if (!userId) {
        localStorage.removeItem("shoppingCartId");
        localStorage.setItem("shoppingCartId", newShoppingCart._id);
      }
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
    let shoppingCart = {};
    try {
      if (userId) {
        const shoppingCarts = await listShoppingCarts();
        shoppingCart = await shoppingCarts.find((existShoppingCart) =>
          existShoppingCart.userId._id.equals(userId)
        );
      } else {
        const shoppingCartId = localStorage.getItem("shoppingCartId");
        shoppingCart = await showShoppingCart(shoppingCartId);
      }
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
    let shoppingCart = {};
    try {
      if (userId) {
        const shoppingCarts = await listShoppingCarts();
        shoppingCart = await shoppingCarts.find((existShoppingCart) =>
          existShoppingCart.userId._id.equals(userId)
        );
      } else {
        const shoppingCartId = localStorage.getItem("shoppingCartId");
        shoppingCart = await showShoppingCart(shoppingCartId);
      }
      if (shoppingCart) {
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

router.put("/empty-shopping-cart", getToken(), async (req, res, next) => {
  const { userId } = req;
  try {
    if (userId) {
      const shoppingCarts = await listShoppingCarts();
      const shoppingCart = await shoppingCarts.find((existShoppingCart) =>
        existShoppingCart.userId._id.equals(userId)
      );
      const emptyShoppingCart = await modifyShoppingCart(shoppingCart._id, {
        products: [],
        price: 0,
        userId,
      });
      res.status(201).json(emptyShoppingCart);
    } else {
      const shoppingCart = await showShoppingCart(
        localStorage.getItem("shoppingCartId")
      );
      const emptyShoppingCart = await modifyShoppingCart(shoppingCart._id, {
        products: [],
        price: 0,
        userId: undefined,
      });
      res.status(201).json(emptyShoppingCart);
    }
  } catch (error) {
    duplicateKeyError(req, res, next, error);
  }
});

router.delete(
  "/shopping-cart/:userId",
  authorization(true),
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { userId: id } = req.params;
    try {
      const shoppingCarts = await listShoppingCarts();
      const shoppingCartId = await shoppingCarts.find(({ userId }) =>
        userId.equals(id)
      );
      const shoppingCart = await deleteShoppingCart(shoppingCartId);
      res.json(shoppingCart);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
