const User = require("../models/user/user");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(appError("You are not logged in baby", 401));
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    return next(appError("Unauthorized Access", 401));
  }
};

module.exports = isLoggedIn;
