import mongoose, { Schema, model } from 'mongoose';
const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});
const Company = mongoose.model('Company', companySchema);

export default Company;
