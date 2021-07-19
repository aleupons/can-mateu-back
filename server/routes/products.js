const { body } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:products");
const { listProducts } = require("../../db/controllers/products");
const { validationErrors } = require("../errors");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const productsList = await listProducts();
    res.json(productsList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
