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
const { validationErrors } = require("../errors");
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
    const comment = req.body;
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
    const { id } = req.params;
    const comment = req.body;
    try {
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
    const { id } = req.params;
    try {
      const comment = await deleteComment(id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
