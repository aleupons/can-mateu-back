require("dotenv").config();
const express = require("express");
const debug = require("debug")("can-mateu:server:main");
const morgan = require("morgan");
const cors = require("cors");

const { app, serverInit } = require("./init");
const usersRoute = require("./routes/users");
const shoppingCartsRoute = require("./routes/shoppingCarts");
const productsRoute = require("./routes/products");
const paymentsRoute = require("./routes/payments");
const ordersRoute = require("./routes/orders");
const couponsRoute = require("./routes/coupons");
const commentsRoute = require("./routes/comments");
const basketsRoute = require("./routes/baskets");
const { error404, generalError } = require("./errors");
const { authorization } = require("./authorization");

const serverStart = () => {
  serverInit();

  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());

  app.use("/users", usersRoute);
  app.use("/shopping-carts", shoppingCartsRoute);
  app.use("/products", productsRoute);
  app.use("/payments", authorization(false), paymentsRoute);
  app.use("/orders", authorization(false), ordersRoute);
  app.use("/coupons", authorization(true), couponsRoute);
  app.use("/comments", commentsRoute);
  app.use("/baskets", basketsRoute);

  app.use(error404);
  app.use(generalError);
};

module.exports = serverStart;
