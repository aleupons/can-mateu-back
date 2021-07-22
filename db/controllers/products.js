const Product = require("../models/Product");
const { list, read, create, update, deleteData } = require("./generalCrud");
const {
  listDataByName,
  listDataByCategory,
  listDataAndOrderBy,
  listRecommended,
} = require("./generalLists");

const model = Product;
const modelName = "producte";

const listProducts = async () => list(model, modelName);

const listProductsByName = async (name) =>
  listDataByName(name, model, modelName);
const listProductsByCategory = async (category) =>
  listDataByCategory(category, model, modelName);
const listProductsAndOrderBy = async (field) =>
  listDataAndOrderBy(field, model, modelName);
const listRecommendedProducts = async (userId) =>
  listRecommended(userId, model, modelName);

const showProduct = async (productId) => read(productId, model, modelName);
const createProduct = async (newProduct) =>
  create(newProduct, model, modelName);
const modifyProduct = async (productId, modifiedProduct) =>
  update(productId, modifiedProduct, model, modelName);
const deleteProduct = async (productId) =>
  deleteData(productId, model, modelName);

module.exports = {
  listProducts,
  listProductsByName,
  listProductsByCategory,
  listProductsAndOrderBy,
  listRecommendedProducts,
  showProduct,
  createProduct,
  modifyProduct,
  deleteProduct,
};
