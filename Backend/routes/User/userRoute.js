const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPasswod,
  getUserProfile,
  updatePassword,
  updateUserProfile,
  allusers,
  getUserDetails,
  updateUser,
  deleteUser,
  // registerNewUser,
} = require("../../controllers/authController/authController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const authorizedRoles = require("../../middlewares/authorizedRoles");

const userRoute = express.Router();

userRoute.post("/user/new", registerUser);
// userRoute.post("/user/neww", registerNewUser);
userRoute.post("/user/login", loginUser);
userRoute.post("/password/forgot", forgotPassword);
userRoute.put("/password/reset/:token", resetPasswod);
userRoute.put("/password/update", isLoggedIn, updatePassword);
userRoute.put("/me/update", isLoggedIn, updateUserProfile);

//profile

userRoute.get("/me", isLoggedIn, getUserProfile);
userRoute.get("/logout", logout);

//Admin routes
userRoute.get("/admin/users", isLoggedIn, authorizedRoles("admin"), allusers);
userRoute.get(
  "/admin/user/:id",
  isLoggedIn,
  authorizedRoles("admin"),
  getUserDetails
);
userRoute.post(
  "/admin/user/:id",
  isLoggedIn,
  authorizedRoles("admin"),
  updateUser
);
userRoute.delete(
  "/admin/user/:id",
  isLoggedIn,
  authorizedRoles("admin"),
  deleteUser
);

module.exports = userRoute;
