import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv/config";
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error.message);
  });

/* ROUTES */
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

/* ERROR MIDDLEWARE */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internel Server Error!";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
