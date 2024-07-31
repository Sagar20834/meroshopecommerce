const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name"],
      trim: true,
      maxlength: [100, "Product Name Cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter Product Price"],
      maxlength: [5, "Product Price Cannot exceed 5 characters"],
      defaultValue: 0.0,
    },
    description: {
      type: String,
      required: [true, "Please Enter Product Description"],
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Rating must be a positive number"],
      max: [5, "Rating must be between 0 and 5"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please Select a Category"],
      enum: {
        values: [
          "Electronics",
          "Clothing",
          "Books",
          "Laptops",
          "Home & Garden",
          "Toys & Hobbies",
          "Sports & Outdoors",
          "Beauty & Health",
          "Kids & Babies",
          "Office Supplies",
          "Automotive",
          "Pet Supplies",
          "Home & Office",
          "Travel",
          "Gifts & Memorabilia",
          "Crafts & Hobbies",
          "Baby & Kids",
          "Other",
        ],
        message: "Please select a valid category for product.",
      },
    },
    seller: {
      type: String,
      required: [true, "Please Enter Seller Name"],
    },
    stock: {
      type: Number,
      required: [true, "Please Enter Stock Quantity"],
      maxlength: [5, "Product price cannot exceed 5 characters"],
      default: 0,
    },
    numofReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [1, "Rating must be between 1 and 5"],
          max: [5, "Rating must be between 1 and 5"],
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
