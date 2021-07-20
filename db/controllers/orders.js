const Order = require("../models/Order");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Order;
const modelName = "comanda";
const fieldsToPopulate = "userId shoppingCartId";

const listOrders = async () => list(model, modelName, fieldsToPopulate);
const showOrder = async (orderId) =>
  read(orderId, model, modelName, fieldsToPopulate);
const createOrder = async (newOrder) => create(newOrder, model, modelName);
const modifyOrder = async (orderId, modifiedOrder) =>
  update(orderId, modifiedOrder, model, modelName);
const deleteOrder = async (orderId) => deleteData(orderId, model, modelName);

module.exports = {
  listOrders,
  showOrder,
  createOrder,
  modifyOrder,
  deleteOrder,
};
