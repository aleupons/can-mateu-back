require("dotenv").config();
const express = require("express");
const debug = require("debug")("can-mateu:server:init");
const chalk = require("chalk");
const { serverError } = require("./errors");

const app = express();

const port = process.env.PORT || process.env.SERVER_PORT || 4000;

const serverInit = () => {
  const server = app.listen(port, () => {
    console.log(chalk.yellow(`\nServidor actiu al port ${port}`));
  });

  server.on("error", (err) => serverError(err, port));
};

module.exports = { app, serverInit };
