const { generateError } = require("../../server/errors");
const User = require("../models/User");

const listUsers = async () => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      const newError = generateError("No hi ha cap usuari registrat", 404);
      throw newError;
    }
    return users;
  } catch (error) {
    const newError = error.code
      ? error
      : generateError("No es poden llistar els usuaris", 404);
    throw newError;
  }
};

const showUser = async (idUser) => {
  try {
    const user = await User.findOne({ _id: idUser });
    if (!user) {
      const newError = generateError("Aquest usuari no existeix");
      throw newError;
    }
    return user;
  } catch (error) {
    const newError = error.code
      ? error
      : generateError("No es pot obtenir aquest usuari", 404);
    throw newError;
  }
};

const createUser = async (newUser) => {
  try {
    const user = await User.create(newUser);
    return user;
  } catch (error) {
    const newError = generateError("No s'ha pogut crear l'usuari", 404);
    throw newError;
  }
};

const modifyUser = async (userId, modifiedUser) => {
  try {
    const searchedUser = await User.findOne({ _id: userId });
    if (!searchedUser) {
      const newError = generateError("Aquest usuari no existeix");
      throw newError;
    }
    const user = await User.findByIdAndUpdate(searchedUser._id, modifiedUser);
    return user;
  } catch (error) {
    const newError = error.code
      ? error
      : generateError("No s'ha pogut modificar l'usuari");
    throw newError;
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      const newError = generateError("Aquest usuari no existeix");
      throw newError;
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    return deletedUser;
  } catch (error) {
    const newError = error.code
      ? error
      : generateError("No es pot eliminar aquest usuari", 404);
    throw newError;
  }
};

module.exports = {
  listUsers,
  showUser,
  createUser,
  modifyUser,
  deleteUser,
};
