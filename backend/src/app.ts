import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      name: "Task Management System API",
      status: "ok",
    });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
