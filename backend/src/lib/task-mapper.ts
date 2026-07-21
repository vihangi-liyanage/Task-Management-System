import type { Task } from "../types.js";

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
};

function toDateInput(value: string | Date) {
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return value.slice(0, 10);
}

function toIso(value: string | Date) {
  const normalized = value instanceof Date ? value : new Date(value);
  return normalized.toISOString();
}

export function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    priority: row.priority as Task["priority"],
    status: row.status as Task["status"],
    dueDate: toDateInput(row.due_date),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}
