import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/connectDB.js";

import mongoose from "mongoose";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)), quiet: true });

const requiredEnv = process.env.MONGO_URI || process.env.NODE_ENV === "production" ? ["MONGO_URI", "JWT_SECRET"] : [];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}. Check Backend/.env`);
  process.exit(1);
}

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  if (process.env.MONGO_URI) {
    await connectDB();
  } else {
    console.log("Demo mode: mood recommendations are available; accounts require MongoDB.");
  }
  const server = app.listen(PORT, (error) => {
    if (error) {
      console.error(`Unable to start the backend on port ${PORT}: ${error.message}`);
      process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.disconnect();
      console.log("HTTP server closed");
      process.exit(0);
    });
    // Force exit if graceful shutdown hangs.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
