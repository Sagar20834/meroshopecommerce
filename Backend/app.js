const express = require("express");
const productRoutes = require("./routes/Product/productRoute");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const userRoute = require("./routes/User/userRoute");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser()); // to parse cookies from requests

app.use(express.json());

app.use("/api/v1/", productRoutes);
app.use("/api/v1/", userRoute);

app.use(globalErrorHandler);

module.exports = app;
