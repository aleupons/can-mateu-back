const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:users");
const {
  listUsers,
  showUser,
  createUser,
  modifyUser,
  deleteUser,
} = require("../../db/controllers/users");
const { validationErrors } = require("../errors");
const userSchema = require("../checkSchemas/userSchema");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const usersList = await listUsers();
    res.json(usersList);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  check("id", "id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await showUser(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/new-user",
  checkSchema(userSchema),
  validationErrors,
  async (req, res, next) => {
    const user = req.body;
    try {
      const newUser = await createUser(user);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  check("id", "id incorrecta").isMongoId(),
  checkSchema(userSchema),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    const user = req.body;
    try {
      const modifiedUser = await modifyUser(id, user);
      res.json(modifiedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  check("id", "id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await deleteUser(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
