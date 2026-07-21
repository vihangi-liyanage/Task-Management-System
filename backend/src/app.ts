import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { healthRouter } from "./routes/health.js";
import { tasksRouter } from "./routes/tasks.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
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
  app.use("/api/tasks", tasksRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
