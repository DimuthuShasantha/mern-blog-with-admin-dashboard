import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      !username === "" ||
      email === "" ||
      password === ""
    )
      return next(errorHandler(400, "All feilds are required!"));

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully!" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || username === "" || password === "")
      return next(errorHandler(400, "All feilds are required!"));
    const validUser = await User.findOne({ username });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, "Invalid credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc
    res
      .status(200)
      .cookie("ACCESS_TOKEN", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
