import express from 'express';
import { isAdmin, requiredSignIn } from '../middleware/authMiddleware.js';
import {
  getAllOrdersController,
  getOrdersController,
  orderStatusController,
} from '../controllers/ordersController.js';

const orderRouter = express.Router();

//orders
orderRouter.get('/orders', requiredSignIn, getOrdersController);

//all orders
orderRouter.get('/all-orders', requiredSignIn, isAdmin, getAllOrdersController);

// order status update
orderRouter.put(
  '/order-status/:orderId',
  requiredSignIn,
  isAdmin,
  orderStatusController
);

export default orderRouter;
