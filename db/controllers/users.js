const User = require("../models/User");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = User;
const modelName = "usuari";

const listUsers = async () => list(model, modelName);
const showUser = async (userId) => read(userId, model, modelName);
const createUser = async (newUser) => create(newUser, model, modelName);
const modifyUser = async (userId, modifiedUser) =>
  update(userId, modifiedUser, model, modelName);
const deleteUser = async (userId) => deleteData(userId, model, modelName);

module.exports = {
  listUsers,
  showUser,
  createUser,
  modifyUser,
  deleteUser,
};
