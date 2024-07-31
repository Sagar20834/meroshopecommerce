const Product = require("../models/product/product");

const dotenv = require("dotenv");

dotenv.config({
  path: "Backend/config/.env",
});
require("../config/dbConnect");

const products = require("../data/product.json");

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("All products deleted");
    await Product.insertMany(products);
    console.log("All products Inserted successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedProducts();
