import type { Task } from "../types";
import { formatDateLabel } from "../lib/date";

type TaskListProps = {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskList({ tasks, loading, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <section className="panel">
        <p className="muted">Loading tasks...</p>
      </section>
    );
  }

  if (!tasks.length) {
    return (
      <section className="panel empty-state">
        <p className="eyebrow">No tasks yet</p>
        <h3>Create the first task to populate the board.</h3>
        <p className="muted">
          Use the task editor to add work items, then search, filter, and sort them from this
          dashboard.
        </p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Task list</p>
          <h2>{tasks.length} tasks</h2>
        </div>
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <strong>{task.title}</strong>
                  {task.description ? <p className="table-description">{task.description}</p> : null}
                </td>
                <td>
                  <span className={`pill priority-${task.priority}`}>{task.priority}</span>
                </td>
                <td>
                  <span className={`pill status-${task.status}`}>{task.status}</span>
                </td>
                <td>{formatDateLabel(task.dueDate)}</td>
                <td>{formatDateLabel(task.updatedAt.slice(0, 10))}</td>
                <td>
                  <div className="table-actions">
                    <button className="text-button" type="button" onClick={() => onEdit(task)}>
                      Edit
                    </button>
                    <button className="text-button danger" type="button" onClick={() => onDelete(task)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
