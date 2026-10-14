import { useEffect, useState } from "react";
import { apiRequest } from "./services/api";
import { useAuth } from "./context/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState("pending");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Fetch tasks when the selected filter changes.
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError("");

      try {
        const query =
          status === "all" ? "" : `?status=${status}`;

        const data = await apiRequest(`/api/tasks${query}`);
        setTasks(data.tasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [status]);

  // Create a task.
  async function createTask(event) {
    event.preventDefault();
    setCreating(true);
    setError("");

    try {
      const data = await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          status: newTaskStatus,
        }),
      });

      const newTask = data.task ?? data.data;

      if (!newTask?._id) {
        throw new Error(
          "Unexpected response from the server. Check your POST /api/tasks response."
        );
      }

      // Show the new task if it matches the active filter.
      if (
        status === "all" ||
        status === newTask.status
      ) {
        setTasks((currentTasks) => [newTask, ...currentTasks]);
      }

      setTitle("");
      setDescription("");
      setNewTaskStatus("pending");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }
  

async function updateTaskStatus(id, newStatus) {
  setError("");
  setUpdatingTaskId(id);

  try {
    const data = await apiRequest(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });

    const updatedTask = data.task ?? data.data;

    if (!updatedTask?._id) {
      throw new Error(
        "Unexpected response from the server when updating the task."
      );
    }

    setTasks((currentTasks) =>
      currentTasks
        .map((task) => (task._id === id ? updatedTask : task))
        .filter(
          (task) => status === "all" || task.status === status
        )
    );
  } catch (err) {
    setError(err.message);
  } finally {
    setUpdatingTaskId(null);
  }
}


  // Delete a task.
  
async function deleteTask(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) return;

  setError("");
  setDeletingTaskId(id);

  try {
    await apiRequest(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task._id !== id)
    );
  } catch (err) {
    setError(err.message);
  } finally {
    setDeletingTaskId(null);
  }
}

  return (
    <main style={styles.container} className="dashboard">
      <header style={styles.header} className="dash-header">
        <div>
          <h1>TaskTrack</h1>
          <p>Your personal task dashboard</p>
        </div>

        <button onClick={logout} style={styles.button} className="btn btn-secondary">
          Logout
        </button>
      </header>

      <section>
        <form onSubmit={createTask} style={styles.createForm} className="create-form">
          <h2>Create a New Task</h2>

          <div>
            <label htmlFor="taskTitle">Task title</label>
            <input
              id="taskTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Learn React"
              style={styles.input}
              required
            />
          </div>

          <div>
            <label htmlFor="taskDescription">Description</label>
            <textarea
              id="taskDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your task..."
              style={styles.input}
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="newTaskStatus">Task status</label>
            <select
              id="newTaskStatus"
              value={newTaskStatus}
              onChange={(event) =>
                setNewTaskStatus(event.target.value)
              }
              style={styles.select}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={creating}
            style={styles.button}
            className="btn btn-primary"
          >
            {creating ? "Creating..." : "Add Task"}
          </button>
        </form>

        <h2 className="section-title">My Tasks ({tasks.length})</h2>

        <label htmlFor="status" className="filter-label">Filter by status: </label>
        <select
          id="status"
          className="filter-select"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          style={styles.select}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {loading && <p className="state-msg">Loading tasks...</p>}
        {error && <p style={styles.error} className="alert alert-error">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p className="state-msg">No tasks found. Create your first task above!</p>
        )}

        <div style={styles.list} className="task-list">
          {tasks.map((task) => (
            <article key={task._id} style={styles.card} className="task-card" data-status={task.status}>
              <div className="task-body">
                <h3>{task.title}</h3>
                <p className="task-desc">{task.description || "No description"}</p>
                <p className="task-status-row">
                  
<div>
  <label htmlFor={`task-status-${task._id}`}>
    Status:
  </label>

  <select
  id={`task-status-${task._id}`}
  value={task.status}
  disabled={updatingTaskId === task._id}
  onChange={(event) =>
    updateTaskStatus(task._id, event.target.value)
  }
  style={styles.select}
>
  <option value="pending">Pending</option>
  <option value="in-progress">In Progress</option>
  <option value="completed">Completed</option>
</select>
</div>

                </p>

                {task.dueDate && (
                  <p className="task-due">
                    Due:{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <button
  onClick={() => deleteTask(task._id)}
  disabled={deletingTaskId === task._id}
  style={styles.deleteButton}
  className="btn btn-danger"
>
  {deletingTaskId === task._id ? "Deleting..." : "Delete"}
</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

// Visual styling now lives in index.css (classNames above).
// The keys are kept so existing `style={styles.x}` references still resolve.
const styles = {
  container: {},
  header: {},
  createForm: {},
  input: {},
  list: {},
  card: {},
  button: {},
  select: {},
  deleteButton: {},
  error: {},
};