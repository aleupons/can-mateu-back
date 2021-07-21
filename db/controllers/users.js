const User = require("../models/User");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = User;
const modelName = "usuari";

const listUsers = async () => {
  const users = await list(model, modelName);
  const usersObj = users.map((user) => {
    const userObj = user.toJSON();
    delete userObj.password;
    return userObj;
  });
  return usersObj;
};
const showUser = async (userId) => {
  const user = await read(userId, model, modelName);
  const userObj = user.toJSON();
  delete userObj.password;
  return userObj;
};
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
