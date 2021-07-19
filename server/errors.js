const { validationResult } = require("express-validator");
const debug = require("debug")("can-mateu:server:errors");
const chalk = require("chalk");

const generateError = (message, code) => {
  const newError = new Error(message);
  newError.code = code;
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
  next();
};

const serverError = (err, port) => {
  console.log(chalk.red("No s'ha pogut aixecar el servidor"));
  if (err.code === "EADDRINUSE") {
    console.log(chalk.red(`El port ${chalk.red.bold(port)} està ocupat`));
  }
};

const error404 = (req, res, next) => {
  res.status(404).json({ error: true, message: "La ruta no existeix" });
};

const generalError = (err, req, res, next) => {
  const code = err.code || 500;
  const customMessage = err.code ? err.message : "Error general";
  res.status(code).json({ error: true, message: customMessage });
};

module.exports = {
  validationErrors,
  serverError,
  error404,
  generalError,
  generateError,
};
