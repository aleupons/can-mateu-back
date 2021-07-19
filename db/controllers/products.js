const Product = require("../models/Product");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Product;
const modelName = "producte";

const listProducts = async () => list(model, modelName);
const showProduct = async (productId) => read(productId, model, modelName);
const createProduct = async (newProduct) =>
  create(newProduct, model, modelName);
const modifyProduct = async (productId, modifiedProduct) =>
  update(productId, modifiedProduct, model, modelName);
const deleteProduct = async (productId) =>
  deleteData(productId, model, modelName);

module.exports = {
  listProducts,
  showProduct,
  createProduct,
  modifyProduct,
  deleteProduct,
};
