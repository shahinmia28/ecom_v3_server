import express from 'express';
import { isAdmin, requiredSignIn } from '../middleware/authMiddleware.js';
import {
  CancelOrderByUser,
  getAllOrdersController,
  getOrdersController,
  OrderCheckout,
  orderCheckoutWithoutPayment,
  orderStatusController,
  paymentFail,
  paymentSuccess,
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
// order cancel by user
orderRouter.delete('/cancel-order/:_id', CancelOrderByUser);

// //payments routes
orderRouter.post('/order-checkout', requiredSignIn, OrderCheckout);

// Check out without payment || cash on delivery
orderRouter.post(
  '/order-checkout-without-payment',
  requiredSignIn,
  orderCheckoutWithoutPayment
);

orderRouter.post('/payment/success/:trx_id', paymentSuccess);
orderRouter.post('/payment/fail/:trx_id', paymentFail);

export default orderRouter;
