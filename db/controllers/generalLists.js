const { generateError } = require("../../server/errors");

const listDataByName = async (name, model, modelName) => {
  const regex = new RegExp(`${name}`, "i");
  try {
    const list = await model.find({ name: { $regex: regex } }).sort({
      name: "asc",
    });
    if (list.length === 0) {
      const newError = generateError(
        `No hi ha cap ${modelName} amb aquest nom`,
        404
      );
      throw newError;
    }
    return list;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError(`No es poden llistar ${modelName}`, 404);
    throw newError;
  }
};

const listDataByCategory = async (category, model, modelName) => {
  try {
    const list = await model.find({ category }).sort({ name: "asc" });
    if (list.length === 0) {
      const newError = generateError(
        `No hi ha cap ${modelName} en aquesta categoria`,
        404
      );
      throw newError;
    }
    return list;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError(`No es poden llistar ${modelName}`, 404);
    throw newError;
  }
};

const listDataAndOrderBy = async (field, model, modelName) => {
  try {
    const order = field === "discount" ? "desc" : "asc";
    const list = await model.find().sort({
      [field]: order,
    });
    if (list.length === 0) {
      const newError = generateError(
        `No hi ha cap ${modelName} en aquesta categoria`,
        404
      );
      throw newError;
    }
    return list;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError(`No es poden llistar ${modelName}`, 404);
    throw newError;
  }
};

const listRecommended = async (userId, model, modelName) => {
  try {
    const list = await model.find().limit(8);
    if (list.length === 0) {
      const newError = generateError(
        `No hi ha cap ${modelName} per recomanar`,
        404
      );
      throw newError;
    }
    return list;
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError(`No es poden llistar ${modelName}`, 404);
    throw newError;
  }
};

module.exports = {
  listDataByName,
  listDataByCategory,
  listDataAndOrderBy,
  listRecommended,
};
