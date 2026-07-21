import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { env } from "../config/env.js";
import { pool } from "../db/pool.js";
import { ApiError } from "../lib/api-error.js";
import { asyncRoute } from "../lib/async-route.js";
import { signAuthToken } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

authRouter.post(
  "/login",
  asyncRoute(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid login data", parsed.error.flatten());
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const result = await pool.query(
      `SELECT id, name, email, password FROM users WHERE email = $1`,
      [normalizedEmail],
    );

    const user = result.rows[0];
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
      parsed.data.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new ApiError(401, "Invalid email or password");
    }

    const safeUser = {
      id: user.id as string,
      name: user.name as string,
      email: user.email as string,
    };

    res.json({
      token: signAuthToken(safeUser),
      user: safeUser,
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }),
);

authRouter.post(
  "/logout",
  asyncRoute(async (_req, res) => {
    res.json({ message: "Logged out successfully" });
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncRoute(async (req, res) => {
    res.json({ user: req.user });
  }),
);

