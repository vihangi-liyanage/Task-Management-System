import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { pool } from "./pool.js";

export async function bootstrapDatabase() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL DEFAULT 'Admin User',
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
      status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
      due_date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);`,
  );

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  await pool.query(
    `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        updated_at = NOW();
    `,
    ["Admin User", env.ADMIN_EMAIL, passwordHash],
  );
}

