import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import routes from "./src/routes/routes.js";
import { connectDB } from "./db.js";

dotenv.config({
  path: ".env",
});

const { BASE_URL, PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
  })
);
app.use(routes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is listening on ${BASE_URL}\n`);
});
