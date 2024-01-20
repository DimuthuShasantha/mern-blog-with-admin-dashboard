import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

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
      return res.status(400).json({ message: "All feilds are required!" });

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
