import mongoose, { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    user: {
      type: {},
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sell_price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    fetcher: {
      type: Boolean,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = model('Product', productSchema);

export default Product;
