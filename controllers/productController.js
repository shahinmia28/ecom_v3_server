import Product from '../models/productSchema.js';
import fs from 'fs';
import slugify from 'slugify';
import Category from '../models/categoryModel.js';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cloudinary from '../helpers/cloudinary.js';
import User from '../models/userModel.js';

dotenv.config();

// create product
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      company,
      quantity,
      discount,
      color,
      fetcher,
    } = req.body;
    // Validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !company ||
      !quantity ||
      !discount ||
      !color ||
      !fetcher
    ) {
      return res.status(500).send({ message: 'All fields are required n' });
    }

    // Images File Handling
    const urls = [];
    const files = req.files;

    if (files.length !== 0) {
      for (const file of files) {
        const { path } = file;
        const result = await cloudinary.uploader.upload(path);
        const data = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        urls.push(data);
        fs.unlinkSync(path);
      }
    } else {
      return res.status(500).send({ message: 'Image is required' });
    }

    // Check if Product Already Exists
    const productExist = await Product.findOne({ name });
    if (productExist) {
      return res.status(502).send({
        message: 'Product Name is Already Exist. please try another Name',
      });
    }

    let sell_price = Math.round(price - price * (discount / 100));

    // Create New Product
    const product = new Product({
      name,
      description,
      price,
      discount,
      sell_price,
      category,
      company,
      quantity,
      color,
      fetcher,
      images: urls,
      slug: slugify(name),
      reviews: [],
    });

    await product.save();
    if (!product) {
      for (const url of urls) {
        const { public_id } = url;
        await cloudinary.uploader.destroy(public_id);
      }
    }

    res.status(201).send({
      success: true,
      message: 'Product Created Successfully',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Product does not Create',
    });
  }
};

// review at controller

export const pushReview = async (req, res) => {
  try {
    const { user_id, rating, comment } = req.body;

    // Check for missing data
    if (!user_id || !rating || !comment) {
      return res.status(400).send({
        success: false,
        message: 'Please provide user_id, rating, and comment.',
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).send({
        success: false,
        message: 'Rating must be between 1 and 5.',
      });
    }

    // Find user
    const user = await User.findById(user_id);

    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'Product not found.',
      });
    }

    // Push the review to the product's reviews array
    product.reviews.push({
      user,
      rating,
      comment,
    });

    // Save the updated product document
    await product.save();

    // Respond with success message
    res.status(201).send({
      success: true,
      message: 'Thanks for your comments and Ratting',
      product,
    });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).send({
      success: false,
      message: 'An error occurred while saving the review.',
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { product_id, comment_id } = req.body;

    await Product.updateOne(
      { _id: product_id },
      { $pull: { reviews: { _id: comment_id } } }
    );
    res.status(202).send({
      success: true,
      message: 'Review deleted',
    });
  } catch (error) {
    console.log(error);
  }
};

//get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category')
      .populate('company')
      .sort({ createdAt: -1 })
      .limit(500);

    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: 'All products get successfully ',
      products,
    });
  } catch (error) {
    console.log(error);
  }
};
// get single product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      'category'
    );
    res.status(200).send({
      success: true,
      message: 'Single Product is Fetched',
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

//delete controller
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await Product.findById({ _id: id });

    for (const image of product.images) {
      const { public_id } = image;
      await cloudinary.uploader.destroy(public_id);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: 'Product Deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while deleting product',
      error,
    });
  }
};

//update product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      company,
      quantity,
      discount,
      color,
      fetcher,
    } = req.body;

    const id = req.params.pid;
    // Validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !company ||
      !quantity ||
      !discount ||
      !color ||
      !fetcher
    ) {
      return res.status(500).send({ message: 'All fields are required' });
    }

    const oldProduct = await Product.findById({ _id: id });

    const files = req.files;

    const urls = files.length !== 0 ? [] : oldProduct.images;

    if (files.length !== 0) {
      // delete old images
      for (const image of oldProduct.images) {
        const { public_id } = image;
        await cloudinary.uploader.destroy(public_id);
      }
      // urls = [];
      // set new images
      for (const file of files) {
        const { path } = file;
        const result = await cloudinary.uploader.upload(path);
        const data = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        urls.push(data);
        fs.unlinkSync(path);
      }
    }

    let sell_price = Math.round(price - price * (discount / 100));

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        discount,
        sell_price,
        category,
        company,
        quantity,
        color,
        fetcher,
        images: urls,
        slug: slugify(name),
      },
      { new: true }
    );

    await product.save();

    res.status(201).send({
      success: true,
      message: 'Product Updated Successfully',
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

// similar products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select('-photo')
      .limit(6)
      .populate('category');
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

// get product by category
export const productCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category }).populate('category');
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};
