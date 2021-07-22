const Basket = require("../models/Basket");
const { list, read, create, update, deleteData } = require("./generalCrud");
const {
  listDataByName,
  listDataByCategory,
  listDataAndOrderBy,
  listRecommended,
} = require("./generalLists");

const model = Basket;
const modelName = "cistella";

const listBaskets = async () => list(model, modelName);

const listBasketsByName = async (name) =>
  listDataByName(name, model, modelName);
const listBasketsByCategory = async (category) =>
  listDataByCategory(category, model, modelName);
const listBasketsAndOrderBy = async (field) =>
  listDataAndOrderBy(field, model, modelName);
const listRecommendedBaskets = async (userId) =>
  listRecommended(userId, model, modelName);

const showBasket = async (basketId) => read(basketId, model, modelName);
const createBasket = async (newBasket) => create(newBasket, model, modelName);
const modifyBasket = async (basketId, modifiedBasket) =>
  update(basketId, modifiedBasket, model, modelName);
const deleteBasket = async (basketId) => deleteData(basketId, model, modelName);

module.exports = {
  listBaskets,
  listBasketsByName,
  listBasketsByCategory,
  listBasketsAndOrderBy,
  listRecommendedBaskets,
  showBasket,
  createBasket,
  modifyBasket,
  deleteBasket,
};
