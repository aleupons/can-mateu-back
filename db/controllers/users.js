const bcrypt = require("bcrypt");
const { generateError } = require("../../server/errors");
const User = require("../models/User");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = User;
const modelName = "usuari";

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const newError = generateError("Credencials incorrectes", 403);
      throw newError;
    }
    const foundPassword = await bcrypt.compare(password, user.password);
    if (!foundPassword) {
      const newError = generateError("Credencials incorrectes", 403);
      throw newError;
    }
    return user._id;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError(
          "No s'han pogut comprovar les credencials de l'usuari",
          404
        );
    throw newError;
  }
};

const listAdminUsers = async () => {
  try {
    const adminUsers = await User.find({ isAdmin: true });
    if (adminUsers.length === 0) {
      const newError = generateError("No hi ha cap administrador", 404);
      throw newError;
    }
    return adminUsers;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError("No es poden llistar els administradors", 404);
    throw newError;
  }
};

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

const createUser = async (newUser) => {
  try {
    const encryptedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = encryptedPassword;
    const user = await model.create(newUser);
    return user;
  } catch (error) {
    const newError = error;
    throw newError;
  }
};

const modifyUser = async (userId, modifiedUser) =>
  update(userId, modifiedUser, model, modelName);
const deleteUser = async (userId) => deleteData(userId, model, modelName);

module.exports = {
  loginUser,
  listAdminUsers,
  listUsers,
  showUser,
  createUser,
  modifyUser,
  deleteUser,
};
