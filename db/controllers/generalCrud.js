const { generateError } = require("../../server/errors");

const list = async (model, modelName) => {
  try {
    const records = await model.find();
    if (records.length === 0) {
      const newError = generateError(`No hi ha cap ${modelName}`, 404);
      throw newError;
    }
    return records;
  } catch (error) {
    const newError = error.code
      ? error
      : generateError(`No es poden llistar els ${modelName}s`, 404);
    throw newError;
  }
};

const read = async (id, model, modelName) => {
  try {
    const record = await model.findOne({ _id: id });
    if (!record) {
      const newError = generateError(`Aquest ${modelName} no existeix`);
      throw newError;
    }
    return record;
  } catch (error) {
    const newError = error.code
      ? error
      : generateError(`No es pot obtenir aquest ${modelName}`, 404);
    throw newError;
  }
};

const create = async (newData, model, modelName) => {
  try {
    const record = await model.create(newData);
    return record;
  } catch (error) {
    const newError = generateError(`No s'ha pogut crear el ${modelName}`, 404);
    throw newError;
  }
};

const update = async (id, modifiedData, model, modelName) => {
  try {
    const searchedRecord = await model.findOne({ _id: id });
    if (!searchedRecord) {
      const newError = generateError(`Aquest ${modelName} no existeix`);
      throw newError;
    }
    const record = await model.findByIdAndUpdate(
      searchedRecord._id,
      modifiedData
    );
    return record;
  } catch (error) {
    const newError = error.code
      ? error
      : generateError(`No s'ha pogut modificar el ${modelName}`);
    throw newError;
  }
};

const deleteData = async (id, model, modelName) => {
  try {
    const record = await model.findOne({ _id: id });
    if (!record) {
      const newError = generateError(`Aquest ${modelName} no existeix`);
      throw newError;
    }
    const deletedRecord = await model.findByIdAndDelete(id);
    return deletedRecord;
  } catch (error) {
    const newError = error.code
      ? error
      : generateError(`No es pot eliminar aquest ${modelName}`, 404);
    throw newError;
  }
};

module.exports = {
  list,
  read,
  create,
  update,
  deleteData,
};
