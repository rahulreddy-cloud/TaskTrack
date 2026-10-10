
import { useState, useEffect } from 'react';
import './App.css';

const API = 'http://127.0.0.1:8082/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTasks() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error('Could not load tasks');
      setTasks(await response.json());
      setError('');
    } catch {
      setError('Cannot connect to backend. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();
    const title = taskName.trim();
    if (!title) return;

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false }),
      });
      if (!response.ok) throw new Error('Could not add task');
      setTaskName('');
      await loadTasks();
    } catch {
      setError('Task could not be added. Check the backend.');
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
      });
      if (!response.ok) throw new Error('Could not update task');
      await loadTasks();
    } catch {
      setError('Task status could not be updated.');
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Could not delete task');
      await loadTasks();
    } catch {
      setError('Task could not be deleted.');
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Pending') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="app">
      <header className="header">
        <h1>TaskTrack</h1>
        <p>Your simple student task manager</p>
      </header>

      <main className="dashboard">
        {error && <p role="alert">{error}</p>}

        <section className="stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{tasks.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{pendingCount}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{completedCount}</p>
          </div>
        </section>

        <section className="task-section">
          <h2>Add a Task</h2>
          <form className="add-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="Enter your task..."
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              required
            />
            <button type="submit">Add Task</button>
          </form>
        </section>

        <section className="task-section">
          <div className="task-heading">
            <h2>My Tasks</h2>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter tasks"
            >
              <option value="All">All Tasks</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <p>Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="empty-message">
              No tasks yet. Add your first task!
            </p>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li className="task-item" key={task.id}>
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />
                    <span className={task.completed ? 'completed' : ''}>
                      {task.title}
                    </span>
                  </label>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>TaskTrack | Student Productivity Made Simple</p>
      </footer>
    </div>
  );
}

export default App;
