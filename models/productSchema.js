import mongoose, { Schema, model } from 'mongoose';

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
    },
    category: {
      type: mongoose.ObjectId,
      ref: 'Category',
      required: true,
    },
    company: {
      type: mongoose.ObjectId,
      ref: 'Company',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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
    reviews: [
      {
        user: String,
        user_image: String,
        rating: Number,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

const Product = model('Products', productSchema);

export default Product;
