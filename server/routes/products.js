const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:products");
const {
  listProducts,
  listProductsByName,
  listProductsByCategory,
  listProductsAndOrderBy,
  showProduct,
  createProduct,
  modifyProduct,
  deleteProduct,
} = require("../../db/controllers/products");
const { validationErrors } = require("../errors");
const productSchema = require("../checkSchemas/productSchema");
const { duplicateKeyError } = require("../errors");
const authorization = require("../authorization");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const productsList = await listProducts();
    res.json(productsList);
  } catch (error) {
    next(error);
  }
});

/* ORDENAR I FILTRAR LLISTES */

router.get("/list-by-name/:name", async (req, res, next) => {
  const { name } = req.params;
  try {
    const productsList = await listProductsByName(name);
    res.json(productsList);
  } catch (error) {
    next(error);
  }
});

router.get("/list-by-category/:category", async (req, res, next) => {
  const { category } = req.params;
  try {
    const productsList = await listProductsByCategory(category);
    res.json(productsList);
  } catch (error) {
    next(error);
  }
});

router.get("/list-by-field/:field", async (req, res, next) => {
  const { field } = req.params;
  try {
    const productsList = await listProductsAndOrderBy(field);
    res.json(productsList);
  } catch (error) {
    next(error);
  }
});

/* */

router.get(
  "/product/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const product = await showProduct(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/new-product",
  authorization,
  checkSchema(productSchema),
  validationErrors,
  async (req, res, next) => {
    const product = req.body;
    try {
      const newProduct = await createProduct(product);
      res.status(201).json(newProduct);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.put(
  "/product/:id",
  authorization,
  check("id", "Id incorrecta").isMongoId(),
  checkSchema(productSchema),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const product = req.body;
    try {
      const modifiedProduct = await modifyProduct(id, product);
      res.json(modifiedProduct);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.delete(
  "/product/:id",
  authorization,
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const product = await deleteProduct(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
