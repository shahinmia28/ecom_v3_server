import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB is connected`);
  } catch (error) {
    console.log('MongoDB is not connect');
  }
};
export default connectDB;

// connection url ${connect.connection.host}
