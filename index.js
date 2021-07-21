const debug = require("debug")("can-mateu");
const dbConnection = require("./db");
const serverStart = require("./server");

dbConnection(serverStart);
