const { check, checkSchema } = require("express-validator");
const express = require("express");
const jwt = require("jsonwebtoken");
const debug = require("debug")("can-mateu:server:routes:users");
const { LocalStorage } = require("node-localstorage");
require("dotenv").config();
const {
  loginUser,
  listAdminUsers,
  listUsers,
  showUser,
  createUser,
  modifyUser,
  deleteUser,
} = require("../../db/controllers/users");
const { validationErrors } = require("../errors");
const userSchema = require("../checkSchemas/userSchema");
const { duplicateKeyError } = require("../errors");
const { authorization, getToken } = require("../authorization");
const {
  listShoppingCarts,
  modifyShoppingCart,
} = require("../../db/controllers/shoppingCarts");

const localStorage = new LocalStorage("./scratch");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const { userId, admin } = await loginUser(username, password);
    const token = jwt.sign({ userId, admin }, process.env.SECRET_JWT, {
      expiresIn: "1w",
    });
    res.json({ token, userId });
  } catch (error) {
    next(error);
  }
});

router.get("/list-admins", authorization(true), async (req, res, next) => {
  try {
    const adminsList = await listAdminUsers();
    res.json(adminsList);
  } catch (error) {
    next(error);
  }
});

router.get("/list", authorization(true), async (req, res, next) => {
  try {
    const usersList = await listUsers();
    res.json(usersList);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/user/:id",
  authorization(true),
  check("id", "Id incorrecta").isMongoId(),
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

router.get("/my-user", authorization(false), async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await showUser(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/new-user",
  checkSchema(userSchema),
  validationErrors,
  async (req, res, next) => {
    const user = req.body;
    const shoppingCartId = localStorage.getItem("shoppingCartId");
    try {
      const newUser = await createUser(user);
      if (shoppingCartId) {
        const shoppingCarts = await listShoppingCarts();
        const shoppingCart = await shoppingCarts.find(({ _id }) =>
          _id.equals(shoppingCartId)
        );
        shoppingCart.userId = newUser._id;
        await modifyShoppingCart(shoppingCartId, shoppingCart);
        localStorage.removeItem("shoppingCartId");
      }
      res.status(201).json(newUser);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.put("/user", authorization(false), async (req, res, next) => {
  const { userId } = req;
  const user = req.body;
  try {
    const modifiedUser = await modifyUser(userId, user);
    res.json(modifiedUser);
  } catch (error) {
    duplicateKeyError(req, res, next, error);
  }
});

router.delete("/user", authorization(false), async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await deleteUser(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
