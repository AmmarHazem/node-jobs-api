const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (request, response) => {
  const { name, email, password } = request.body;
  // if (!name || !email || !password) {
  //   throw new BadRequestError("name, email and password are required");
  // }
  const user = await UserModel.create({ name, email, password });
  const token = await user.createJWT();
  response
    .status(StatusCodes.CREATED)
    .json({ user: { id: user._id, name, email }, token });
};

const login = async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    throw new BadRequestError("email and password are required");
  }
  const user = await UserModel.findOne({ email });
  const invalidCredentialsError = new UnauthenticatedError(
    "invalid credentials"
  );
  if (!user) {
    throw invalidCredentialsError;
  }
  const passwordMatched = await user.checkPassword(password);
  if (!passwordMatched) {
    throw invalidCredentialsError;
  }
  const token = await user.createJWT();
  response.json({
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
};

module.exports = {
  register,
  login,
};
