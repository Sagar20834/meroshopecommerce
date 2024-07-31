const express = require("express");
const {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/productController/productController");
const {
  isAuthenticatedUser,
  authorizedRoles,
} = require("../../middlewares/isAuthenticatedUser");

const productRoutes = express.Router();

productRoutes.get(
  "/products",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  getProducts
);
productRoutes.get("/product/:id", isAuthenticatedUser, getSingleProduct);
productRoutes.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  createProduct
);
productRoutes.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  updateProduct
); //admin route
productRoutes.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  deleteProduct
); //admin route

module.exports = productRoutes;
