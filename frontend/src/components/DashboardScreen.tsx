import { useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchTaskSummary,
  fetchTasks,
  updateTask,
} from "../lib/api";
import type {
  AuthUser,
  Task,
  TaskFilters,
  TaskInput,
  TaskPriority,
  TaskSort,
  TaskStatus,
  TaskSummary,
} from "../types";
import { SummaryCards } from "./SummaryCards";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { todayAsDateInput } from "../lib/date";

type DashboardScreenProps = {
  token: string;
  user: AuthUser;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onLogout: () => Promise<void> | void;
};

const emptyTask = (): TaskInput => ({
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  dueDate: todayAsDateInput(),
});

const defaultFilters: TaskFilters = {
  search: "",
  status: "",
  priority: "",
  sort: "newest",
};

const initialSummary: TaskSummary = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
};

export function DashboardScreen({
  token,
  user,
  theme,
  onToggleTheme,
  onLogout,
}: DashboardScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary>(initialSummary);
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [draft, setDraft] = useState<TaskInput>(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TaskInput, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isEditing = Boolean(editingTaskId);
  const activeFilters = useMemo(() => filters, [filters]);

  function validateDraft(value: TaskInput) {
    const nextErrors: Partial<Record<keyof TaskInput, string>> = {};
    const today = todayAsDateInput();

    if (!value.title.trim()) {
      nextErrors.title = "Title is required.";
    }
    if (!value.priority) {
      nextErrors.priority = "Priority is required.";
    }
    if (!value.status) {
      nextErrors.status = "Status is required.";
    }
    if (!value.dueDate) {
      nextErrors.dueDate = "Due date is required.";
    } else if (value.dueDate < today) {
      nextErrors.dueDate = "Due date cannot be earlier than today.";
    }

    return nextErrors;
  }

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [taskResponse, summaryResponse] = await Promise.all([
          fetchTasks(token, activeFilters),
          fetchTaskSummary(token),
        ]);

        if (active) {
          setTasks(taskResponse.items);
          setSummary(summaryResponse);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load tasks");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, [token, activeFilters]);

  function startEdit(task: Task) {
    setEditingTaskId(task.id);
    setDraft({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    });
    setFormErrors({});
    setNotice("");
  }

  function resetForm() {
    setEditingTaskId(null);
    setDraft(emptyTask());
    setFormErrors({});
  }

  async function saveTask() {
    const nextErrors = validateDraft(draft);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setError("Please fix the highlighted task fields.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingTaskId) {
        await updateTask(token, editingTaskId, draft);
        setNotice("Task updated successfully.");
      } else {
        await createTask(token, draft);
        setNotice("Task created successfully.");
      }

      resetForm();
      const [taskResponse, summaryResponse] = await Promise.all([
        fetchTasks(token, activeFilters),
        fetchTaskSummary(token),
      ]);
      setTasks(taskResponse.items);
      setSummary(summaryResponse);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  }

  async function removeTask(task: Task) {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await deleteTask(token, task.id);
      setNotice("Task deleted successfully.");
      if (editingTaskId === task.id) {
        resetForm();
      }
      const [taskResponse, summaryResponse] = await Promise.all([
        fetchTasks(token, activeFilters),
        fetchTaskSummary(token),
      ]);
      setTasks(taskResponse.items);
      setSummary(summaryResponse);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Authenticated session</p>
          <h1>Welcome back, {user.name}</h1>
          <p className="lead">{user.email}</p>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button" type="button" onClick={onToggleTheme}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button className="ghost-button" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <SummaryCards summary={summary} />

      <section className="toolbar panel">
        <label>
          Search title
          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, search: event.target.value }))
            }
            placeholder="Search tasks"
          />
        </label>

        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                status: event.target.value as TaskStatus | "",
              }))
            }
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={filters.priority}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                priority: event.target.value as TaskPriority | "",
              }))
            }
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Sort
          <select
            value={filters.sort}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                sort: event.target.value as TaskSort,
              }))
            }
          >
            <option value="newest">Newest Created</option>
            <option value="oldest">Oldest Created</option>
            <option value="due_date">Due Date</option>
          </select>
        </label>
      </section>

      {error ? <p className="error-banner">{error}</p> : null}
      {notice ? <p className="success-banner">{notice}</p> : null}

      <section className="content-grid">
        <TaskForm
          value={draft}
          isEditing={isEditing}
          submitting={saving}
          errors={formErrors}
          onChange={setDraft}
          onSubmit={() => void saveTask()}
          onCancel={resetForm}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={startEdit}
          onDelete={(task) => void removeTask(task)}
        />
      </section>
    </main>
  );
}
