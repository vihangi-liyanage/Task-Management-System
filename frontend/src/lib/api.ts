import type {
  AuthUser,
  LoginResponse,
  Task,
  TaskFilters,
  TaskInput,
  TaskSummary,
} from "../types";

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

function toQueryString(filters: TaskFilters) {
  const params = new URLSearchParams();
  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.priority) {
    params.set("priority", filters.priority);
  }
  if (filters.sort) {
    params.set("sort", filters.sort);
  }
  return params.toString();
}

export async function fetchTasks(token: string, filters: TaskFilters) {
  const query = toQueryString(filters);
  return request<{ items: Task[] }>(`/tasks${query ? `?${query}` : ""}`, {
    token,
  });
}

export async function fetchTask(token: string, taskId: string) {
  return request<{ item: Task }>(`/tasks/${taskId}`, {
    token,
  });
}

export async function createTask(token: string, payload: TaskInput) {
  return request<{ item: Task }>("/tasks", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateTask(
  token: string,
  taskId: string,
  payload: TaskInput,
) {
  return request<{ item: Task }>(`/tasks/${taskId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(token: string, taskId: string) {
  await request<void>(`/tasks/${taskId}`, {
    method: "DELETE",
    token,
    headers: {},
  });
}

export async function fetchTaskSummary(token: string) {
  const response = await request<{ summary: TaskSummary }>("/dashboard/summary", {
    token,
  });

  return response.summary;
}
