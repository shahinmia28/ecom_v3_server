import Order from '../models/orderModel.js';
import SSLCommerzPayment from 'sslcommerz-lts';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error WHile Getting Orders',
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('products', '-photo')
      .populate('buyer')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error WHile Geting Orders',
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error While Updating Order',
      error,
    });
  }
};

// order Checkout Without Payment
export const orderCheckoutWithoutPayment = async (req, res) => {
  try {
    const { product, user, totalPrice } = req.body;

    const finalOrder = {
      products: product,
      buyer: user._id,
      totalPrice: totalPrice,
      payment: false,
    };
    const result = await Order.create(finalOrder);

    // totalAmount: product.amount,
    res.status(200).send({
      success: true,
      message: 'Order Placed Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(402).send({
      success: false,
      message: 'Something Wrong, Please Try again',
    });
  }
};

// Payment gateway API
const store_id = process.env.SSLCOMMERCE_STORE_ID;
const store_passwd = process.env.SSLCOMMERCE_STORE_PASSWORD;
const is_live = false; // true for live, false for sandbox

export const OrderCheckout = async (req, res) => {
  try {
    const { product, user, totalPrice } = req.body;
    const trx_id = new mongoose.Types.ObjectId().toString();

    const data = {
      total_amount: totalPrice,
      currency: 'BDT',
      tran_id: trx_id, // Use unique tran_id for each API call
      success_url: `${process.env.API_URL}/api/order/payment/success/${trx_id}`,
      fail_url: `${process.env.API_URL}/api/order/payment/fail/${trx_id}`,
      cancel_url: `${process.env.API_URL}`,
      ipn_url: `${process.env.API_URL}`,
      shipping_method: 'Courier',
      product_name: 'Computer',
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: user?.name,
      cus_email: user?.email,
      cus_add1: user?.address,
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: user?.phone,
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    // Redirect the user to payment gateway
    const GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });

    // Save the order in the database
    const finalOrder = {
      products: product,
      buyer: user._id,
      totalPrice: totalPrice,
      payment: false,
      transaction_id: trx_id,
    };
    await Order.create(finalOrder);
  } catch (error) {
    console.log('Error in OrderCheckout:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Payment success
export const paymentSuccess = async (req, res) => {
  try {
    const result = await Order.findOneAndUpdate(
      { transaction_id: req.params.trx_id },
      { payment: true }
    );

    if (result) {
      res.redirect(
        `${process.env.CLIENT_URL}/payment/success/${req.params.trx_id}`
      );
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.log('Error in paymentSuccess:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Payment fail
export const paymentFail = async (req, res) => {
  try {
    const result = await Order.findOneAndDelete({
      transaction_id: req.params.trx_id,
    });

    if (result) {
      res.redirect(
        `${process.env.CLIENT_URL}/payment/fail/${req.params.trx_id}`
      );
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.log('Error in paymentFail:', error);
    res.status(500).send('Internal Server Error');
  }
};

// cancel order
export const CancelOrderByUser = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params._id);
    res.status(200).send({
      success: true,
      message: 'Order Cancel successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: true,
      message: 'Order Not Cancel',
    });
  }
};
