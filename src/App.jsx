import { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, hasLoaded]);

  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Work");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input, completed: false, category },
    ]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Derived metrics
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  // Filter tasks
  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.category === filter);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <button onClick={() => setDarkMode(!darkMode)} className="toggle-mode">
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h1>Productivity App</h1>

      {/* Filter Buttons */}
      <div className="filters">
        {["All", "Work", "Study", "Personal"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "active-filter" : ""}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <p className="metrics">
        Total: {tasks.length} | Completed: {completedCount} | Pending:{" "}
        {pendingCount}
      </p>

      {/* Clear Completed Button */}
      <button className="clear-btn" onClick={clearCompleted}>
        Clear Completed
      </button>

      {/* Task Input */}
      <TaskInput
        input={input}
        setInput={setInput}
        category={category}
        setCategory={setCategory}
        addTask={addTask}
      />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default App;