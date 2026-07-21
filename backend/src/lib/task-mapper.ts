import type { Task } from "../types.js";

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
};

export function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    priority: row.priority as Task["priority"],
    status: row.status as Task["status"],
    dueDate: row.due_date.slice(0, 10),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

