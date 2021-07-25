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
  shoppingCartProductRemoveSchema,
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
      userId ? userId._id.equals(id) : false
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
          existShoppingCart.userId
            ? existShoppingCart.userId._id.equals(userId)
            : false
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
        if (
          JSON.stringify(product) !== "{}" ||
          JSON.stringify(basket) !== "{}"
        ) {
          // Si existeix el producte que ens passen
          let productToModify = {};
          if (JSON.stringify(product) !== "{}") {
            productToModify = shoppingCart.products.find((existsProduct) =>
              existsProduct.productId
                ? existsProduct.productId._id.equals(productId)
                : false
            );
          } else if (JSON.stringify(basket) !== "{}") {
            productToModify = shoppingCart.products.find((existsProduct) =>
              existsProduct.basketId
                ? existsProduct.basketId._id.equals(productId)
                : false
            );
          }
          if (productToModify) {
            // Si el carro ja té el producte
            const products = shoppingCart.products.map((productToQuantify) => {
              if (productToQuantify.productId) {
                if (productToQuantify.productId._id.equals(productId)) {
                  productToQuantify.amount = amount;
                  productToQuantify.price = product.priceUnit * amount;
                }
              } else if (productToQuantify.basketId) {
                if (productToQuantify.basketId._id.equals(productId)) {
                  productToQuantify.amount = amount;
                  productToQuantify.price = basket.priceUnit * amount;
                }
              }
              return productToQuantify;
            });
            shoppingCart.products = products;
          } else {
            // Si el carro no té el producte
            shoppingCart.products.push({
              productId: !isBasket ? productId : undefined,
              basketId: isBasket ? productId : undefined,
              amount,
              price:
                (JSON.stringify(product) !== "{}"
                  ? product.priceUnit
                  : basket.priceUnit) * amount,
            });
          }
        } else {
          throw generateError("Aquest producte o cistella no existeix", 400);
        }
      } else {
        throw generateError("Aquest usuari no té cap carro", 400);
      }
      shoppingCart.price = shoppingCart.products.reduce((counter, product) => {
        counter += product.price;
        return counter;
      }, 0);
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
  checkSchema(shoppingCartProductRemoveSchema),
  validationErrors,
  getToken(),
  async (req, res, next) => {
    const { userId } = req;
    const { productId } = req.params;
    const { isBasket } = req.body;
    let shoppingCart = {};
    try {
      if (userId) {
        const shoppingCarts = await listShoppingCarts();
        shoppingCart = await shoppingCarts.find((existShoppingCart) =>
          existShoppingCart.userId
            ? existShoppingCart.userId._id.equals(userId)
            : false
        );
      } else {
        const shoppingCartId = localStorage.getItem("shoppingCartId");
        shoppingCart = await showShoppingCart(shoppingCartId);
      }
      if (shoppingCart) {
        if (!isBasket) {
          if (
            shoppingCart.products.find((existsProduct) =>
              existsProduct.productId
                ? existsProduct.productId._id.equals(productId)
                : false
            )
          ) {
            shoppingCart.products = shoppingCart.products.filter((product) =>
              product.productId
                ? !product.productId._id.equals(productId)
                : true
            );
          } else {
            throw generateError("Aquest producte no està al carro", 400);
          }
        } else if (isBasket) {
          if (
            shoppingCart.products.find((existsProduct) =>
              existsProduct.basketId
                ? existsProduct.basketId._id.equals(productId)
                : false
            )
          ) {
            shoppingCart.products = shoppingCart.products.filter((product) =>
              product.basketId ? !product.basketId._id.equals(productId) : true
            );
          } else {
            throw generateError("Aquesta cistella no està al carro", 400);
          }
        }
      } else {
        throw generateError("Aquest usuari no té cap carro", 400);
      }
      shoppingCart.price = shoppingCart.products.reduce((counter, product) => {
        counter += product.price;
        return counter;
      }, 0);
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
      const shoppingCart = await shoppingCarts.find((existsShoppingCart) =>
        existsShoppingCart.userId
          ? existsShoppingCart.userId._id.equals(userId)
          : false
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

router.delete("/shopping-cart", getToken(), async (req, res, next) => {
  const { userId } = req;
  try {
    if (userId) {
      const shoppingCarts = await listShoppingCarts();
      const shoppingCart = await shoppingCarts.find((existsShoppingCart) =>
        existsShoppingCart.userId
          ? existsShoppingCart.userId._id.equals(userId)
          : false
      );
      const deletedShoppingCart = await deleteShoppingCart(shoppingCart._id);
      res.status(201).json(deletedShoppingCart);
    } else {
      const shoppingCartId = await showShoppingCart(
        localStorage.getItem("shoppingCartId")
      );
      const deletedShoppingCart = await deleteShoppingCart(shoppingCartId);
      res.status(201).json(deletedShoppingCart);
    }
  } catch (error) {
    duplicateKeyError(req, res, next, error);
  }
});

module.exports = router;
