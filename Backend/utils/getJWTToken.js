const jwt = require("jsonwebtoken");
const getJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = getJWTToken;
