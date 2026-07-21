import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.js";

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

  app.use("/health", healthRouter);

  return app;
}

