import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://tasktrack-backend-rahul.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load tasks from backend
  const loadTasks = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();
      setTasks(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when website opens
  useEffect(() => {
    loadTasks();
  }, []);

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a task.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();

      setTasks((currentTasks) => [...currentTasks, newTask]);
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to add task.");
    }
  };

  // Toggle task completion
  const toggleTask = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to update task.");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );

      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete task.");
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>TaskTrack</h1>
          <p>Simple. Smart. Organized.</p>
        </div>

        <button className="refresh-btn" onClick={loadTasks}>
          ↻ Refresh
        </button>
      </header>

      <main className="container">
        <section className="hero">
          <h2>Manage Your Tasks</h2>
          <p>
            Keep track of your daily tasks and monitor your progress in one
            place.
          </p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-number">{totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">{pendingTasks}</span>
            <span className="stat-label">Pending</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">{completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </section>

        <section className="add-section">
          <h2>Add a New Task</h2>

          <form onSubmit={addTask} className="task-form">
            <input
              type="text"
              placeholder="Enter your task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button type="submit">
              + Add Task
            </button>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="tasks-section">
          <div className="section-heading">
            <h2>My Tasks</h2>

            <span>
              {totalTasks === 0
                ? "No tasks"
                : `${totalTasks} task${totalTasks !== 1 ? "s" : ""}`}
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading tasks...</h3>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>Add your first task above to get started.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  className={`task-card ${
                    task.completed ? "completed" : ""
                  }`}
                  key={task.id}
                >
                  <div className="task-left">
                    <button
                      className={`check-btn ${
                        task.completed ? "checked" : ""
                      }`}
                      onClick={() => toggleTask(task)}
                      title={
                        task.completed
                          ? "Mark as pending"
                          : "Mark as completed"
                      }
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="task-info">
                      <h3>{task.title}</h3>

                      <span>
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>TaskTrack © 2026 | Stay organized, stay productive.</p>
      </footer>
    </div>
  );
}

export default App;