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
const { validationErrors } = require("../errors");
const basketSchema = require("../checkSchemas/basketSchema");
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

/* AFEGIR O TREURE PRODUCTES DE LA CISTELLA */

/* router.post(
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
); */

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
