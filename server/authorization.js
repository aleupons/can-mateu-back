const jwt = require("jsonwebtoken");
const { generateError } = require("./errors");
require("dotenv").config();

const authorization = (adminTask) => async (req, res, next) => {
  if (!req.header("Authorization")) {
    const newError = generateError("Falta el token d'accés", 403);
    return next(newError);
  }
  const token = req.header("Authorization").split(" ")[1];
  try {
    const userInfo = jwt.verify(token, process.env.SECRET_JWT);
    const { userId, admin } = userInfo;
    if (!admin && adminTask) {
      const newError = generateError("No autoritzat", 401);
      throw newError;
    }
    req.userId = userId;
    next();
  } catch (error) {
    const newError = error.statusCode
      ? error
      : generateError("Token no vàlid", 403);
    next(newError);
  }
};

module.exports = { authorization };
