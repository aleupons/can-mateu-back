const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:baskets");
const multer = require("multer");
const {
  listBaskets,
  listBasketsByName,
  listBasketsByCategory,
  listBasketsAndOrderBy,
  showBasket,
  createBasket,
  modifyBasket,
  deleteBasket,
  listRecommendedBaskets,
} = require("../../db/controllers/baskets");
const { validationErrors, generateError } = require("../errors");
const {
  basketSchema,
  basketProductSchema,
} = require("../checkSchemas/basketSchema");
const { duplicateKeyError } = require("../errors");
const { authorization } = require("../authorization");
const fireBase = require("../fireBase");

const router = express.Router();
const upload = multer();

router.get("/list", async (req, res, next) => {
  try {
    const basketsList = await listBaskets();
    res.json(basketsList);
  } catch (error) {
    next(error);
  }
});

/* ORDENAR I FILTRAR LLISTES */

router.get("/list-by-name/:name", async (req, res, next) => {
  const { name } = req.params;
  try {
    const basketsList = await listBasketsByName(name);
    res.json(basketsList);
  } catch (error) {
    next(error);
  }
});

router.get("/list-by-category/:category", async (req, res, next) => {
  const { category } = req.params;
  try {
    const basketsList = await listBasketsByCategory(category);
    res.json(basketsList);
  } catch (error) {
    next(error);
  }
});

router.get("/list-by-field/:field", async (req, res, next) => {
  const { field } = req.params;
  try {
    const basketsList = await listBasketsAndOrderBy(field);
    res.json(basketsList);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/list-recommended/:userId",
  authorization(false),
  check("userId", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const basketsList = await listRecommendedBaskets(id);
      res.json(basketsList);
    } catch (error) {
      next(error);
    }
  }
);

/* */

router.get(
  "/basket/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const basket = await showBasket(id);
      res.json(basket);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/new-basket",
  authorization(true),
  upload.single("photoUrl"),
  checkSchema(basketSchema),
  validationErrors,
  async (req, res, next) => {
    const basket = req.body;
    try {
      const date = new Date();
      const modifiedBasket = { ...basket, date };
      fireBase(req, res, next, createBasket, modifiedBasket);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/basket/:id",
  authorization(true),
  check("id", "Id incorrecta").isMongoId(),
  upload.single("photoUrl"),
  checkSchema(basketSchema),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const basket = req.body;
    try {
      const date = new Date();
      const modifiedBasket = { ...basket, date };
      fireBase(req, res, next, modifyBasket, modifiedBasket, id);
    } catch (error) {
      next(error);
    }
  }
);

/* AFEGIR O TREURE PRODUCTES DE LA CISTELLA */

router.put(
  "/basket/add/:id",
  authorization(true),
  check("id", "Id incorrecta").isMongoId(),
  checkSchema(basketProductSchema),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const basketProduct = req.body;
    try {
      const basket = await showBasket(id);
      console.log(basketProduct._id === false);
      if (basketProduct._id !== undefined) {
        // Si la cistella ja té el producte
        const products = basket.basketProducts.map((productToModify) => {
          if (productToModify._id.equals(basketProduct._id)) {
            productToModify = basketProduct;
          }
          return productToModify;
        });
        basket.basketProducts = products;
      } else {
        // Si la cistella no té el producte
        basket.basketProducts.push(basketProduct);
      }
      const modifiedBasket = await modifyBasket(id, basket);
      res.json(modifiedBasket);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.put(
  "/basket/remove/:id",
  authorization(true),
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const { _id: basketProductId } = req.body;
    try {
      const basket = await showBasket(id);
      if (
        basket.basketProducts.find((existsProduct) =>
          existsProduct._id.equals(basketProductId)
        )
      ) {
        // Si la cistella ja té el producte
        basket.basketProducts = basket.basketProducts.filter(
          (productToModify) => !productToModify._id.equals(basketProductId)
        );
      } else {
        // Si la cistella no té el producte
        throw generateError("Aquest producte no està a la cistella", 400);
      }
      const modifiedBasket = await modifyBasket(id, basket);
      res.json(modifiedBasket);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

/* */

router.delete(
  "/basket/:id",
  authorization(true),
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const basket = await deleteBasket(id);
      res.json(basket);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
