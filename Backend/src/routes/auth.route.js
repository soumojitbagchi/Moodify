import express from 'express';
import { body } from 'express-validator';
import { loginUser, registerUser, logoutUser, getMe } from '../controller/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import protect, { requireDatabase } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

const passwordLength = (password) => Buffer.byteLength(password, 'utf8') <= 72;

const registerValidators = [
  body('name').isString().withMessage('Name is required').bail().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('username').isString().withMessage('Username is required').bail().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters').matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),
  body('email').isString().withMessage('Valid email is required').bail().trim().isLength({ max: 254 }).isEmail().withMessage('Valid email is required').toLowerCase(),
  body('password').isString().withMessage('Password is required').bail().isLength({ min: 8 }).withMessage('Password must be at least 8 characters').custom(passwordLength).withMessage('Password must not exceed 72 bytes'),
];

const loginValidators = [
  body().custom((value) => Boolean(value?.email || value?.username)).withMessage('Email or username is required'),
  body('password').isString().withMessage('Password is required').bail().notEmpty().withMessage('Password is required').custom(passwordLength).withMessage('Password must not exceed 72 bytes'),
  body('email').optional().isString().withMessage('Valid email is required').bail().trim().isLength({ max: 254 }).isEmail().withMessage('Valid email is required').toLowerCase(),
  body('username').optional().isString().withMessage('Username must be text').bail().trim().isLength({ min: 1, max: 30 }).withMessage('Username must be 1–30 characters'),
];

authRouter.post('/register', registerValidators, validate, requireDatabase, registerUser);
authRouter.post('/login', loginValidators, validate, requireDatabase, loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/me', protect, getMe);

export default authRouter;
