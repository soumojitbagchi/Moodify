import userData from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    
    
    const existingUser = await userData.findOne({$or: [{ email }, { username }]});
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new userData({
      name,
      email,
      password: newUser.password,
      username,
    });
    const token = jwt.sign({ id: newUser._id , email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token:token , success: true, message: "User registered successfully" });
  }catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const loginUser = async (req, res) => {
  try {
    const { email, password ,username} = req.body;
    const user = await userData.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id , email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token:token ,success: true, message: "User logged in successfully" });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};