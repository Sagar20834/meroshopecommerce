const express = require("express");
const {
  createOrder,
  myOrders,
  getSingleOrder,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../../controllers/orderController/orderController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const authorizedRoles = require("../../middlewares/authorizedRoles");

const orderRoute = express.Router();

orderRoute.post("/order/new", isLoggedIn, createOrder);
orderRoute.get("/order/:id", isLoggedIn, getSingleOrder);
orderRoute.get("/orders/me", isLoggedIn, myOrders);
orderRoute.get(
  "/admin/orders",
  isLoggedIn,
  authorizedRoles("admin"),
  allOrders
);
orderRoute.put(
  "/admin/order/:id",
  isLoggedIn,
  authorizedRoles("admin"),
  updateOrder
);
orderRoute.delete(
  "/admin/order/:id",
  isLoggedIn,
  authorizedRoles("admin"),
  deleteOrder
);

module.exports = orderRoute;
