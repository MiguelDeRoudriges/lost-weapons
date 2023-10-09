import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});
const { DB_URL } = process.env;

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (err) {
    console.log("Failed to connect to DB", err);
  }
};
