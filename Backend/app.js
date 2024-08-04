const express = require("express");
const productRoutes = require("./routes/Product/productRoute");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const userRoute = require("./routes/User/userRoute");
const cookieParser = require("cookie-parser");
const orderRoute = require("./routes/Order/orderRoute");
const app = express();

app.use(cookieParser()); // to parse cookies from requests

app.use(express.json());

app.use("/api/v1/", productRoutes);
app.use("/api/v1/", userRoute);
app.use("/api/v1/", orderRoute);

app.use(globalErrorHandler);

module.exports = app;
