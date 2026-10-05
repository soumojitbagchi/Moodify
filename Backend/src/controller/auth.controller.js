import userData from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
};

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  profilePicture: user.profilePicture,
});

export const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, username } = req.body;
  email = email?.toLowerCase().trim();
  username = username?.trim();

  const existingUser = await userData.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(409).json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userData.create({
    name: name.trim(),
    email,
    password: hashedPassword,
    username,
  });
  const token = signToken(newUser);
  setTokenCookie(res, token);
  res.status(201).json({
    token,
    success: true,
    message: "User registered successfully",
    user: toPublicUser(newUser),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  let { email, password, username } = req.body;
  email = email?.toLowerCase().trim();
  username = username?.trim();

  // Allow login with either email or username; require at least one identifier.
  const orConditions = [];
  if (email) orConditions.push({ email });
  if (username) orConditions.push({ username });
  if (orConditions.length === 0) {
    return res.status(400).json({ success: false, message: "Email or username is required" });
  }

  const user = await userData.findOne({ $or: orConditions });
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const token = signToken(user);
  setTokenCookie(res, token);
  res.status(200).json({
    token,
    success: true,
    message: "User logged in successfully",
    user: toPublicUser(user),
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: toPublicUser(req.user) });
});