import type { AuthUser, LoginResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type RequestOptions = Omit<RequestInit, "headers"> & {
  token?: string | null;
  headers?: Record<string, string>;
};

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error ?? "Something went wrong");
  }

  return body as T;
}

export async function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchCurrentUser(token: string) {
  const response = await request<{ user: AuthUser }>("/auth/me", {
    token,
  });

  return response.user;
}

export async function logout(token: string) {
  await request<{ message: string }>("/auth/logout", {
    method: "POST",
    token,
  });
}

