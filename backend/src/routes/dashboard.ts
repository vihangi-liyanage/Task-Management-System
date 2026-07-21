import { Router } from "express";
import { asyncRoute } from "../lib/async-route.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get(
  "/summary",
  asyncRoute(async (req, res) => {
    const result = await pool.query(
      `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
          COUNT(*) FILTER (WHERE status = 'in_progress')::int AS "inProgress",
          COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
          COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status <> 'completed')::int AS overdue
        FROM tasks
        WHERE user_id = $1
      `,
      [req.user!.id],
    );

    res.json({
      summary: result.rows[0],
    });
  }),
);

