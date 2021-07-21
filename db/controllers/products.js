const { generateError } = require("../../server/errors");
const Product = require("../models/Product");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Product;
const modelName = "producte";

const listProducts = async () => list(model, modelName);

const listProductsByName = async (name) => {
  const regex = new RegExp(`${name}`, "i");
  try {
    const products = await Product.find({ name: { $regex: regex } }).sort({
      name: "asc",
    });
    if (products.length === 0) {
      const newError = generateError(
        "No hi ha cap producte amb aquest nom",
        404
      );
      throw newError;
    }
    return products;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError("No es poden llistar els productes", 404);
    throw newError;
  }
};

const listProductsByCategory = async (category) => {
  try {
    const products = await Product.find({ category }).sort({ name: "asc" });
    if (products.length === 0) {
      const newError = generateError(
        "No hi ha cap producte en aquesta categoria",
        404
      );
      throw newError;
    }
    return products;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError("No es poden llistar els productes", 404);
    throw newError;
  }
};

const listProductsAndOrderBy = async (field) => {
  try {
    const order = field === "discount" ? "desc" : "asc";
    const products = await Product.find().sort({
      [field]: order,
    });
    if (products.length === 0) {
      const newError = generateError(
        "No hi ha cap producte en aquesta categoria",
        404
      );
      throw newError;
    }
    return products;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError("No es poden llistar els productes", 404);
    throw newError;
  }
};

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
  showProduct,
  createProduct,
  modifyProduct,
  deleteProduct,
};
