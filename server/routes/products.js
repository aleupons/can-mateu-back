const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:products");
const multer = require("multer");
const {
  listProducts,
  listProductsByName,
  listProductsByCategory,
  listProductsAndOrderBy,
  showProduct,
  createProduct,
  modifyProduct,
  deleteProduct,
  listRecommendedProducts,
} = require("../../db/controllers/products");
const { validationErrors, generateError } = require("../errors");
const productSchema = require("../checkSchemas/productSchema");
const { duplicateKeyError } = require("../errors");
const { authorization } = require("../authorization");
const fireBase = require("../fireBase");

const router = express.Router();
const upload = multer();

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

router.get(
  "/list-recommended/:productId",
  check("productId", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { productId } = req.params;
    try {
      const productsList = await listRecommendedProducts(productId);
      res.json(productsList);
    } catch (error) {
      next(error);
    }
  }
);

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
  authorization(true),
  upload.single("photoUrl"),
  checkSchema(productSchema),
  validationErrors,
  async (req, res, next) => {
    const product = req.body;
    try {
      const date = new Date();
      if (product.discount !== 0) {
        product.newPrice =
          product.priceUnit - (product.discount / 100) * product.priceUnit;
      }
      const modifiedProduct = { ...product, date };
      fireBase(req, res, next, createProduct, modifiedProduct);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/product/:id",
  authorization(true),
  check("id", "Id incorrecta").isMongoId(),
  upload.single("photoUrl"),
  checkSchema(productSchema),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const product = req.body;
    try {
      const date = new Date();
      if (product.discount !== 0) {
        product.newPrice =
          product.priceUnit - (product.discount / 100) * product.priceUnit;
      }
      const modifiedProduct = { ...product, date };
      fireBase(req, res, next, modifyProduct, modifiedProduct, id);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/product/:id",
  authorization(true),
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
