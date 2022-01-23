const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("invalid token");
  }
  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = payload;
    request.token = token;
    next();
  } catch (e) {
    console.log("--- authMiddleware error");
    console.log(e);
    throw new UnauthenticatedError("invalid auth");
  }
};

module.exports = authenticationMiddleware;
