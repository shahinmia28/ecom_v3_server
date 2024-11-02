import DeliveryCharge from '../models/deliveryChargeModel.js';
import HeroImg from '../models/heroImgModel.js';
import cloudinary from '../helpers/cloudinary.js';
import fs from 'fs';

export const createDeliveryCharge = async (req, res) => {
  try {
    const { insideDhaka, outsideDhaka } = req.body;
    if (!insideDhaka || !outsideDhaka) {
      return res.status(401).send({ message: 'All field is required' });
    }
    // delete old delivery charge
    await DeliveryCharge.deleteMany();

    const deliveryCharge = await DeliveryCharge.create({
      insideDhaka: insideDhaka,
      outsideDhaka: outsideDhaka,
    });

    res.status(201).send({
      success: true,
      message: 'Delivery charge is created successfully',
      deliveryCharge,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Category is not created',
    });
  }
};
// Slider hero img upload and get
export const getDeliveryCharge = async (req, res) => {
  try {
    const deliveryCharge = await DeliveryCharge.find({});

    res.status(200).send({
      success: true,
      message: 'slider hero img get successfully ',
      deliveryCharge,
    });
  } catch (error) {
    console.log(error);
  }
};

// Slider hero img upload
export const uploadHeroImage = async (req, res) => {
  try {
    const files = req.files;
    const oldHeroImg = await HeroImg.find({});
    const urls = [];

    if (files.length !== 0) {
      // delete old images
      if (oldHeroImg.length !== 0) {
        for (const image of oldHeroImg[0].images) {
          const { public_id } = image;
          await cloudinary.uploader.destroy(public_id);
        }
        await HeroImg.deleteMany();
      }

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

    const heroImg = await HeroImg.create({ images: urls });

    res
      .status(201)
      .send({ success: true, message: 'slider image set', data: heroImg });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

// Slider hero img upload and get
export const getHeroImage = async (req, res) => {
  try {
    const heroImg = await HeroImg.find({});

    res.status(200).send({
      success: true,
      message: 'slider hero img get successfully ',
      heroImg,
    });
  } catch (error) {
    console.log(error);
  }
};
