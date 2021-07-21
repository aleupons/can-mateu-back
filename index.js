const debug = require("debug")("can-mateu");
const dbConnection = require("./db");
const { serverStart } = require("./server/init");

dbConnection(serverStart);
