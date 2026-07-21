import type { NextFunction, Request, Response } from "express";
import { pool } from "../db/pool.js";
import { ApiError } from "../lib/api-error.js";
import { verifyAuthToken } from "../lib/jwt.js";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = header.slice("Bearer ".length);
    const payload = verifyAuthToken(token);
    const result = await pool.query(
      `SELECT id, name, email FROM users WHERE id = $1`,
      [payload.sub],
    );

    const user = result.rows[0];
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

