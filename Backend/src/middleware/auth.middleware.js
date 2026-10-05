import jwt from "jsonwebtoken";
import userData from "../model/userSchema.js";
import mongoose from "mongoose";

export const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: "Accounts are unavailable in demo mode. Configure MongoDB to enable sign in and registration." });
  }
  next();
};

// Protect routes: accepts `Authorization: Bearer <token>` or httpOnly `token` cookie.
const protect = async (req, res, next) => {
  try {
    const fromCookie = req.cookies?.token;
    const fromHeader = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = fromCookie || fromHeader;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    if (mongoose.connection.readyState !== 1) return requireDatabase(req, res, next);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userData.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default protect;
