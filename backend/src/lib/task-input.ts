import { z } from "zod";
import type { TaskPriority, TaskStatus } from "../types.js";

const statusSchema = z.enum(["pending", "in_progress", "completed"]);
const prioritySchema = z.enum(["low", "medium", "high"]);

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export const taskCreateSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().max(5000).optional().default(""),
    priority: prioritySchema,
    status: statusSchema,
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid due date"),
  })
  .refine((data) => data.dueDate >= todayIsoDate(), {
    message: "Due date cannot be earlier than today",
    path: ["dueDate"],
  });

export const taskUpdateSchema = taskCreateSchema;

export type TaskCreateInput = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
};

