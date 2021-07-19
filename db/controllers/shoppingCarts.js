const ShoppingCart = require("../models/ShoppingCart");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = ShoppingCart;
const modelName = "carro";

const listShoppingCarts = async () => list(model, modelName);
const showShoppingCart = async (shoppingCartId) =>
  read(shoppingCartId, model, modelName);
const createShoppingCart = async (newShoppingCart) =>
  create(newShoppingCart, model, modelName);
const modifyShoppingCart = async (shoppingCartId, modifiedShoppingCart) =>
  update(shoppingCartId, modifiedShoppingCart, model, modelName);
const deleteShoppingCart = async (shoppingCartId) =>
  deleteData(shoppingCartId, model, modelName);

module.exports = {
  listShoppingCarts,
  showShoppingCart,
  createShoppingCart,
  modifyShoppingCart,
  deleteShoppingCart,
};
