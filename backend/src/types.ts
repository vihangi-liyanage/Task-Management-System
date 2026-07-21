export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

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

export type TaskListFilters = {
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  sort?: "newest" | "oldest" | "due_date";
};
