import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv/config";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
