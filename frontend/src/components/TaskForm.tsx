import { type FormEvent } from "react";
import type { TaskInput, TaskPriority, TaskStatus } from "../types";

type TaskFormProps = {
  value: TaskInput;
  isEditing: boolean;
  submitting: boolean;
  onChange: (next: TaskInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function TaskForm({
  value,
  isEditing,
  submitting,
  onChange,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  function update<K extends keyof TaskInput>(key: K, nextValue: TaskInput[K]) {
    onChange({ ...value, [key]: nextValue });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="panel task-form" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">Task editor</p>
          <h2>{isEditing ? "Edit task" : "Create a task"}</h2>
        </div>
        {isEditing ? (
          <button className="ghost-button" type="button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <label>
        Title
        <input
          value={value.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Plan sprint review"
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={value.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="Add any supporting context or notes"
          rows={4}
        />
      </label>

      <div className="form-grid">
        <label>
          Priority
          <select
            value={value.priority}
            onChange={(event) => update("priority", event.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Status
          <select
            value={value.status}
            onChange={(event) => update("status", event.target.value as TaskStatus)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      <label>
        Due date
        <input
          type="date"
          value={value.dueDate}
          onChange={(event) => update("dueDate", event.target.value)}
          required
        />
      </label>

      <div className="task-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Update task" : "Create task"}
        </button>
      </div>
    </form>
  );
}

