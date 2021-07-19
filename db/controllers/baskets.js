const Basket = require("../models/Basket");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Basket;
const modelName = "cistella";

const listBaskets = async () => list(model, modelName);
const showBasket = async (basketId) => read(basketId, model, modelName);
const createBasket = async (newBasket) => create(newBasket, model, modelName);
const modifyBasket = async (basketId, modifiedBasket) =>
  update(basketId, modifiedBasket, model, modelName);
const deleteBasket = async (basketId) => deleteData(basketId, model, modelName);

module.exports = {
  listBaskets,
  showBasket,
  createBasket,
  modifyBasket,
  deleteBasket,
};
