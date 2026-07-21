import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/api-error.js";

export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details ?? null,
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: "Internal server error",
  });
}

