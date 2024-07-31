const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
} = require("../../controllers/authController/authController");

const userRoute = express.Router();

userRoute.post("/user/new", registerUser);
userRoute.post("/user/login", loginUser);
userRoute.get("/logout", logout);

module.exports = userRoute;
