const Comment = require("../models/Comment");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Comment;
const modelName = "comentari";
const fieldsToPopulate = "productId userId";

const listComments = async () => list(model, modelName, fieldsToPopulate);
const showComment = async (commentId) =>
  read(commentId, model, modelName, fieldsToPopulate);
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
