import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { ApiError } from "../lib/api-error.js";
import { asyncRoute } from "../lib/async-route.js";
import { mapTaskRow } from "../lib/task-mapper.js";
import { taskCreateSchema } from "../lib/task-input.js";
import { requireAuth } from "../middleware/auth.js";
import type { TaskListFilters } from "../types.js";

export const tasksRouter = Router();

const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.string().trim().optional(),
  priority: z.string().trim().optional(),
  sort: z.enum(["newest", "oldest", "due_date"]).optional(),
});

function parseListFilters(query: unknown): TaskListFilters {
  const parsed = listQuerySchema.parse(query);
  const split = (value?: string) =>
    value
      ? value
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
      : undefined;

  return {
    search: parsed.search,
    status: split(parsed.status) as TaskListFilters["status"],
    priority: split(parsed.priority) as TaskListFilters["priority"],
    sort: parsed.sort ?? "newest",
  };
}

function buildListQuery(userId: string, filters: TaskListFilters) {
  const clauses: string[] = ["user_id = $1"];
  const values: Array<string | string[]> = [userId];
  let paramIndex = 2;

  if (filters.search) {
    clauses.push(`title ILIKE $${paramIndex}`);
    values.push(`%${filters.search}%`);
    paramIndex += 1;
  }

  if (filters.status?.length) {
    clauses.push(`status = ANY($${paramIndex}::text[])`);
    values.push(filters.status);
    paramIndex += 1;
  }

  if (filters.priority?.length) {
    clauses.push(`priority = ANY($${paramIndex}::text[])`);
    values.push(filters.priority);
    paramIndex += 1;
  }

  const orderBy =
    filters.sort === "oldest"
      ? "created_at ASC"
      : filters.sort === "due_date"
        ? "due_date ASC, created_at DESC"
        : "created_at DESC";

  const query = `
    SELECT id, title, description, priority, status, due_date, created_at, updated_at
    FROM tasks
    WHERE ${clauses.join(" AND ")}
    ORDER BY ${orderBy}
  `;

  return { query, values };
}

async function findTaskById(taskId: string, userId: string) {
  const result = await pool.query(
    `
      SELECT id, title, description, priority, status, due_date, created_at, updated_at
      FROM tasks
      WHERE id = $1 AND user_id = $2
    `,
    [taskId, userId],
  );

  return result.rows[0] ?? null;
}

tasksRouter.use(requireAuth);

tasksRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const filters = parseListFilters(req.query);
    const { query, values } = buildListQuery(req.user!.id, filters);
    const result = await pool.query(query, values);

    res.json({
      items: result.rows.map(mapTaskRow),
    });
  }),
);

tasksRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const task = await findTaskById(req.params.id, req.user!.id);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    res.json({ item: mapTaskRow(task) });
  }),
);

tasksRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const parsed = taskCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid task data", parsed.error.flatten());
    }

    const result = await pool.query(
      `
        INSERT INTO tasks (user_id, title, description, priority, status, due_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, title, description, priority, status, due_date, created_at, updated_at
      `,
      [
        req.user!.id,
        parsed.data.title,
        parsed.data.description ?? "",
        parsed.data.priority,
        parsed.data.status,
        parsed.data.dueDate,
      ],
    );

    res.status(201).json({ item: mapTaskRow(result.rows[0]) });
  }),
);

tasksRouter.put(
  "/:id",
  asyncRoute(async (req, res) => {
    const parsed = taskCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid task data", parsed.error.flatten());
    }

    const existing = await findTaskById(req.params.id, req.user!.id);
    if (!existing) {
      throw new ApiError(404, "Task not found");
    }

    const result = await pool.query(
      `
        UPDATE tasks
        SET title = $1,
            description = $2,
            priority = $3,
            status = $4,
            due_date = $5,
            updated_at = NOW()
        WHERE id = $6 AND user_id = $7
        RETURNING id, title, description, priority, status, due_date, created_at, updated_at
      `,
      [
        parsed.data.title,
        parsed.data.description ?? "",
        parsed.data.priority,
        parsed.data.status,
        parsed.data.dueDate,
        req.params.id,
        req.user!.id,
      ],
    );

    res.json({ item: mapTaskRow(result.rows[0]) });
  }),
);

tasksRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const deleted = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id`,
      [req.params.id, req.user!.id],
    );

    if (!deleted.rowCount) {
      throw new ApiError(404, "Task not found");
    }

    res.status(204).send();
  }),
);

