import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.ACCESS_TOKEN;
  if (!token) {
    next(errorHandler(401, "Unautherized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return next(errorHandler(401, "Unautherized"));
    req.user = user;
    next();
  });
};
