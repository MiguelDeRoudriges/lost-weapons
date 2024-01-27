import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const { DB_URL } = process.env;

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Failed to connect to DB", err);
  }
};
