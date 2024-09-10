import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, 'Name is Required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid Email!`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      minLength: [6, 'At least 6 characters are required'],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    phone: {
      type: String,
      required: [true, 'Phone Number is Required'],
    },
    answer: {
      type: String,
      required: true,
    },
    address: {
      type: {},
    },
    gender: {
      type: String,
    },
    date_of_birth: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    image: {
      type: Array,
    },
  },
  { timestamps: true }
);

const User = model('users', userSchema);

export default User;
