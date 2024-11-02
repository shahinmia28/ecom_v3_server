import express from 'express';
import {
  createProduct,
  deleteProduct,
  deleteReview,
  getProducts,
  getSingleProduct,
  productCategoryController,
  pushReview,
  relatedProductController,
  updateProduct,
} from '../controllers/productController.js';
import { isAdmin, requiredSignIn } from '../middleware/authMiddleware.js';
import upload from '../helpers/multer.js';

const productRouter = express.Router();

//create product
productRouter.post(
  '/create',
  upload.array('image'),
  requiredSignIn,
  createProduct
);

// product review rout
productRouter.post('/review/:id', requiredSignIn, pushReview);

productRouter.post('/delete_review', requiredSignIn, deleteReview);

//get all products
productRouter.get('/get-all', getProducts);

//single product
productRouter.get('/get-single/:slug', getSingleProduct);

//update product
productRouter.put(
  '/update/:pid',
  upload.array('image'),
  requiredSignIn,
  updateProduct
);

//delete product
productRouter.delete('/delete/:pid', requiredSignIn, deleteProduct);

//similar product
productRouter.get('/related-product/:pid/:cid', relatedProductController);

//category wise product
productRouter.get('/product-category/:slug', productCategoryController);

export default productRouter;
