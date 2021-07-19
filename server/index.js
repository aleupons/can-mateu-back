require("dotenv").config();
const express = require("express");
const debug = require("debug")("can-mateu:server:main");
const morgan = require("morgan");
const cors = require("cors");
const app = require("./init");
const usersRoute = require("./routes/users");
const { error404, generalError } = require("./errors");

const serverStart = () => {
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());

  app.use("/users", usersRoute);

  app.use(error404);
  app.use(generalError);
};

module.exports = serverStart;
