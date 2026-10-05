import express from "express";
import authRouter from "./routes/auth.route.js";
import songRoute from "./routes/song.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import requestLogger from "./middleware/requestLogger.middleware.js";

const app = express();
if (process.env.NODE_ENV !== "test") app.use(requestLogger);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] , credentials: true }));
app.use(cookieParser());

// Health check for uptime monitors / load balancers. No DB dependency.
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "OK", uptime: process.uptime() });
});

app.use("/api/auth", authRouter);
app.use("/api/songs", songRoute);

app.use(notFound);
app.use(errorHandler);

export default app;