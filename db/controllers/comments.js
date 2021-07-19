const Comment = require("../models/Comment");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Comment;
const modelName = "comentari";

const listComments = async () => list(model, modelName);
const showComment = async (commentId) => read(commentId, model, modelName);
const createComment = async (newComment) =>
  create(newComment, model, modelName);
const modifyComment = async (commentId, modifiedComment) =>
  update(commentId, modifiedComment, model, modelName);
const deleteComment = async (commentId) =>
  deleteData(commentId, model, modelName);

module.exports = {
  listComments,
  showComment,
  createComment,
  modifyComment,
  deleteComment,
};
