const appError = require("../utils/appError");

const isAdmin = (...roles) => {
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

module.exports = isAdmin;
