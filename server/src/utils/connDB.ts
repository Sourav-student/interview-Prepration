import mongoose from "mongoose";

export const connDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("MongoDB is connected!");
  } catch (error) {
    console.log(error);
  }
}