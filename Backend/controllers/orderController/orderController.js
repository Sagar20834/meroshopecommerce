const Order = require("../../models/order/Order");
const Product = require("../../models/product/product");
const appError = require("../../utils/appError");

const updateStock = async (id, quantity) => {
  try {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;
    await product.save();
  } catch (error) {
    return next(appError("Error updating stock", 500));
  }
};

// create new order api/v1/order/new

const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//get single order==> /api/va/order/:id

const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return next(appError("No order found with that ID", 404));
    }

    res.status(200).json({
      success: true,
      message: "Order found successfully",
      order,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//get logged in  order==> /api/va/orders/me

const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: "Order found successfully",
      orders,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//get all orders by admin in  order==> /api/v1/admin/orders/

const allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      message: "Order found successfully",
      totalAmount,
      orders,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//update/process order by admin ==> /api/v1/admin/order/:id

const updateOrder = async (req, res, next) => {
  try {
    const orderFound = await Order.findById(req.params.id);

    if (!orderFound) {
      return next(appError("No order found with that ID", 404));
    }

    if (orderFound.orderStatus === "Delivered") {
      return next(appError("You have alredy delivered this order", 400));
    }

    orderFound.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });

    orderFound.orderStatus = req.body.status;
    orderFound.deliveredAt = Date.now();
    await orderFound.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      orderFound,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//update/process order by admin ==> /api/v1/admin/order/:id

const deleteOrder = async (req, res, next) => {
  try {
    const orderFound = await Order.findById(req.params.id);

    if (!orderFound) {
      return next(appError("No order found with that ID", 404));
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  createOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
};
