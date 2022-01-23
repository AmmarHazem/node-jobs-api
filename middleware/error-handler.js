const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err.code === 11000) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Duplicate value", keyValue: err.keyValue });
  }
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMessage = err.message || "Something went wrong";
  return res
    .status(statusCode)
    .json({ message: errorMessage, errors: err.errors });
};

module.exports = errorHandlerMiddleware;
