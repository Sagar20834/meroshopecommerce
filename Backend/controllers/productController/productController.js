const Product = require("../../models/product/product");
const APIFeatures = require("../../utils/apiFeatures");
const appError = require("../../utils/appError");

//create new product api/v1/product/new

const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//get all products api/v1/products

const getProducts = async (req, res, next) => {
  try {
    const resPerPage = 4;
    const productCount = await Product.countDocuments();

    let query = Product.find();
    const apiFeatures = APIFeatures(query, req.query);

    query = apiFeatures.search();
    query = apiFeatures.filter();
    query = apiFeatures.pagination(resPerPage);

    const products = await query;

    if (products) {
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        count: products.length,
        productCount,
        products,
      });
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//get  single product

const getSingleProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return next(appError("Product not found", 500));
    }
    if (product) {
      return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product,
      });
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//update   single product

const updateProduct = async (req, res, next) => {
  try {
    const id = req?.params?.id;
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    } else {
      product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        success: true,
        message: "Product Updated  successfully",
        product,
      });
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//delete   single product

const deleteProduct = async (req, res, next) => {
  try {
    const id = req?.params?.id;
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    } else {
      product = await Product.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Product Deleted successfully",
        product,
      });
    }
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

module.exports = {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
