import express from 'express';
import {
  createDeliveryCharge,
  getDeliveryCharge,
  getHeroImage,
  uploadHeroImage,
} from '../controllers/otherController.js';
import upload from '../helpers/multer.js';
const otherRouter = express.Router();
// delivery charge
otherRouter.post('/delivery-charge', createDeliveryCharge);
otherRouter.get('/delivery-charge', getDeliveryCharge);

// Slider hero img upload and get
otherRouter.post('/hero-img', upload.array('image'), uploadHeroImage);
otherRouter.get('/get-hero-img', getHeroImage);
export default otherRouter;
