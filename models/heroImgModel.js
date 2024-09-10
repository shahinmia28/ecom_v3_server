import { Schema, model } from 'mongoose';

const heroImgModel = new Schema(
  {
    images: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const HeroImg = model('heroImg', heroImgModel);

export default HeroImg;
