import express from "express";
import { body } from "express-validator";
import { loginUser, registerUser, logoutUser, getMe } from "../controller/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import protect from "../middleware/auth.middleware.js";

const authRouter = express.Router();

const registerValidators = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscores"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidators = [
  body("password").notEmpty().withMessage("Password is required"),
  body("email").optional().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("username").optional().trim().notEmpty().withMessage("Username must not be empty"),
];

authRouter.post("/register", registerValidators, validate, registerUser);
authRouter.post("/login", loginValidators, validate, loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", protect, getMe);

export default authRouter;