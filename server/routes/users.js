const { body } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:users");
const { listUsers } = require("../../db/controllers/users");
const { validationErrors } = require("../errors");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const usersList = await listUsers();
    res.json(usersList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
