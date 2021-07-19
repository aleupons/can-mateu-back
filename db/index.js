require("dotenv").config();
const debug = require("debug")("can-mateu:db:connection");
const chalk = require("chalk");
const mongoose = require("mongoose");

const dbConnection = (callback) => {
  mongoose.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        console.log(chalk.red("No s'ha pogut connectar amb la BBDD"));
        console.log(chalk.red(err.message));
        return;
      }
      console.log(chalk.yellow("Connectant a la BBDD"));
      callback();
    }
  );
};

module.exports = dbConnection;
