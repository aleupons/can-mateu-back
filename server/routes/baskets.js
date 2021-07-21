const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:baskets");
const {
  listBaskets,
  showBasket,
  createBasket,
  modifyBasket,
  deleteBasket,
} = require("../../db/controllers/baskets");
const { validationErrors, generateError } = require("../errors");
const {
  basketSchema,
  basketProductSchema,
} = require("../checkSchemas/basketSchema");
const { duplicateKeyError } = require("../errors");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const basketsList = await listBaskets();
    res.json(basketsList);
  } catch (error) {
    next(error);
  }
});

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
  checkSchema(basketSchema),
  validationErrors,
  async (req, res, next) => {
    const basket = req.body;
    try {
      const newBasket = await createBasket(basket);
      res.status(201).json(newBasket);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.put(
  "/basket/:id",
  check("id", "Id incorrecta").isMongoId(),
  checkSchema(basketSchema),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const basket = req.body;
    try {
      const modifiedBasket = await modifyBasket(id, basket);
      res.json(modifiedBasket);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

/* AFEGIR O TREURE PRODUCTES DE LA CISTELLA */

router.put(
  "/basket/add/:id",
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
