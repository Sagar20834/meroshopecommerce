const express = require("express");
const {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteProductReview,
} = require("../../controllers/productController/productController");
const {
  isAuthenticatedUser,
  authorizedRoles,
} = require("../../middlewares/isAuthenticatedUser");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const productRoutes = express.Router();

productRoutes.get(
  "/products",
  isLoggedIn,
  // authorizedRoles("admin"),
  // authorizedRoles("admin"),
  getProducts
);
productRoutes.get(
  "/product/:id",
  isLoggedIn,
  authorizedRoles("admin"),
  getSingleProduct
);
productRoutes.post(
  "/admin/product/new",
  isLoggedIn,
  authorizedRoles("admin"),
  createProduct
);
productRoutes.put(
  "/admin/product/:id",
  isLoggedIn,
  authorizedRoles("admin"),
  updateProduct
); //admin route
productRoutes.delete(
  "/admin/product/:id",
  isLoggedIn,
  authorizedRoles("admin"),
  deleteProduct
); //admin route

productRoutes.put("/review", isLoggedIn, createProductReview);
productRoutes.get("/reviews", isLoggedIn, getProductReviews);
productRoutes.delete("/reviews", isLoggedIn, deleteProductReview);

module.exports = productRoutes;
