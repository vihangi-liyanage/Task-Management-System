import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser } from "../types.js";
import type { SignOptions } from "jsonwebtoken";

type TokenPayload = {
  sub: string;
  email: string;
  name: string;
};

export function signAuthToken(user: AuthUser) {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
