const { check, checkSchema } = require("express-validator");
const express = require("express");
const debug = require("debug")("can-mateu:server:routes:comments");
const {
  listComments,
  showComment,
  createComment,
  modifyComment,
  deleteComment,
} = require("../../db/controllers/comments");
const { validationErrors, generateError } = require("../errors");
const commentSchema = require("../checkSchemas/commentSchema");
const { duplicateKeyError } = require("../errors");
const { authorization } = require("../authorization");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const commentsList = await listComments();
    res.json(commentsList);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/comment/:id",
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const comment = await showComment(id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/new-comment",
  authorization(false),
  checkSchema(commentSchema),
  validationErrors,
  async (req, res, next) => {
    const { userId } = req;
    const comment = req.body;
    comment.userId = userId;
    try {
      const newComment = await createComment(comment);
      res.status(201).json(newComment);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.put(
  "/comment/:id",
  authorization(false),
  check("id", "Id incorrecta").isMongoId(),
  checkSchema(commentSchema),
  validationErrors,
  async (req, res, next) => {
    const { userId } = req;
    const { id } = req.params;
    const comment = req.body;
    try {
      const foundComment = await showComment(id);
      if (!foundComment.userId._id.equals(userId)) {
        throw generateError("Accés denegat", 401);
      }
      const modifiedComment = await modifyComment(id, comment);
      res.json(modifiedComment);
    } catch (error) {
      duplicateKeyError(req, res, next, error);
    }
  }
);

router.delete(
  "/comment/:id",
  authorization(false),
  check("id", "Id incorrecta").isMongoId(),
  validationErrors,
  async (req, res, next) => {
    const { userId } = req;
    const { id } = req.params;
    try {
      const foundComment = await showComment(id);
      if (!foundComment.userId._id.equals(userId)) {
        throw generateError("Accés denegat", 401);
      }
      const comment = await deleteComment(id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
