import { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import confetti from "canvas-confetti";

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
  const [showClearOptions, setShowClearOptions] = useState(false); // To show/hide clear options

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false, category }]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const updated = { ...task, completed: !task.completed };
          if (!task.completed && updated.completed) {
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          }
          return updated;
        }
        return task;
      })
    );
  };

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const clearCompleted = () => setTasks(tasks.filter((task) => !task.completed));

  const clearAll = () => {
    if (tasks.length === 0) return;
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const filteredTasks = filter === "All" ? tasks : tasks.filter((t) => t.category === filter);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      {/* Dark Mode Toggle Button */}
      <button onClick={() => setDarkMode(!darkMode)} className="toggle-mode">
        {darkMode ? "🌙" : "🌞"} {/* Display sun for light mode, moon for dark */}
      </button>

      <h1>Productivity App</h1>

      {/* Filter Buttons */}
      <div className="filters">
        {["All", "Work", "Study", "Personal"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? "active-filter" : ""}>
            {f}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <p className="metrics">
        Total: {tasks.length} | Completed: {completedCount} | Pending: {pendingCount}
      </p>

      {/* Clear Dropdown Button */}
      <div className="clear-btn-wrapper">
        <button
          className="clear-btn"
          onClick={() => setShowClearOptions(!showClearOptions)} // Toggle the dropdown visibility
        >
          Clear <span>▼</span>
        </button>

        {/* Clear Options */}
        {showClearOptions && (
          <div className="clear-options">
            <button onClick={clearCompleted}>Clear Completed</button>
            <button onClick={clearAll}>Clear All</button>
          </div>
        )}
      </div>

      {/* Task Input */}
      <TaskInput
        input={input}
        setInput={setInput}
        category={category}
        setCategory={setCategory}
        addTask={addTask}
      />

      {/* Task List */}
      <TaskList tasks={filteredTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
}

export default App;