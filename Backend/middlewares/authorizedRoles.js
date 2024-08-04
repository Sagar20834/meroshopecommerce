const appError = require("../utils/appError");

const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(appError("You are not an admin", 404));
    }
    next();
  };
};

module.exports = authorizedRoles;
