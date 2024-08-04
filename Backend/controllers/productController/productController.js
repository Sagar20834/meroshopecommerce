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

//create a new review /api/v1/review

const createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) {
    return next(appError("Product not found", 404));
  }
  const isReviewed = product.reviews.find(
    (revw) => revw.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numofReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Product Review created successfully",
    review,
    product,
  });
};

//all review of a product api/v1/reviews

const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return next(appError("Product not found", 500));
    }
    res.status(200).json({
      success: true,
      message: "Product Reviews fetched successfully",
      reviews: product.reviews,
    });
  } catch (error) {
    return next(appError(error.message, 500));
  }
};

//delete the review

const deleteProductReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);
    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.id.toString()
    );

    const numofReviews = reviews.length;

    const ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numofReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product Review deleted successfully",
    });
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
  createProductReview,
  getProductReviews,
  deleteProductReview,
};
