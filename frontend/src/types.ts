export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskSort = "newest" | "oldest" | "due_date";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskSummary = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

export type TaskFilters = {
  search: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  sort: TaskSort;
};

export type TaskInput = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
};

