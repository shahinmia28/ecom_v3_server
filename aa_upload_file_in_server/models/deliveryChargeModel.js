import mongoose, { Schema, model } from 'mongoose';

const deliveryChargeSchema = new Schema({
  insideDhaka: {
    type: Number,
    required: true,
  },
  outsideDhaka: {
    type: Number,
    required: true,
  },
});
const DeliveryCharge = mongoose.model('DeliveryCharge', deliveryChargeSchema);

export default DeliveryCharge;
