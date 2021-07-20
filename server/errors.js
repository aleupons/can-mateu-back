const { validationResult } = require("express-validator");
const debug = require("debug")("can-mateu:server:errors");
const chalk = require("chalk");

const generateError = (message, code) => {
  const newError = new Error(message);
  newError.statusCode = code;
  return newError;
};

const validationErrors = (req, res, next) => {
  const objectErrorMessages = (object) => {
    let message = "";
    const numberOfProperties = Object.keys(object).length;
    let counter = 1;
    for (const [key, value] of Object.entries(object)) {
      if (counter === numberOfProperties) {
        message += value.msg;
      } else {
        message += `${value.msg}, `;
      }
      counter++;
    }
    return message;
  };
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const newError = generateError(objectErrorMessages(error.mapped()), 400);
    return next(newError);
  }
  return next();
};

const serverError = (error, port) => {
  console.log(chalk.red("No s'ha pogut aixecar el servidor"));
  if (error.code === "EADDRINUSE") {
    console.log(chalk.red(`El port ${chalk.red.bold(port)} està ocupat`));
  }
};

const duplicateKeyError = (req, res, next, error) => {
  if (error.name === "MongoError" && error.code === 11000) {
    res.status(422).send({ error: true, message: error.message });
  } else {
    return next(error);
  }
};

const error404 = (req, res, next) => {
  res.status(404).json({ error: true, message: "La ruta no existeix" });
};

const generalError = (error, req, res, next) => {
  const code = error.statusCode || 500;
  const customMessage = error.statusCode ? error.message : "Error general";
  res.status(code).json({ error: true, message: customMessage });
};

module.exports = {
  generateError,
  validationErrors,
  serverError,
  duplicateKeyError,
  error404,
  generalError,
};
