const User = require("../models/user/user");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;
  // Check if token exists and is valid
  // if not, return an error
  if (!token) {
    return next(appError("You are not logged in", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();

  try {
  } catch (error) {
    return next(appError("Authentication failed", 401));
  }
};

//handling user roles

const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    console.log(roles.includes(req.user.role));
    if (!roles.includes(req.user.role)) {
      return next(
        appError(
          `Your role is (${req.user.role}) and it do not has permission to access this route`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { isAuthenticatedUser, authorizedRoles };
