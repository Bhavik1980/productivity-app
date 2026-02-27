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
  const [showClearOptions, setShowClearOptions] = useState(false);

  // Pomodoro timer state
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  // User defined times
  const [workDuration, setWorkDuration] = useState(25); // Default work duration 25 minutes
  const [breakDuration, setBreakDuration] = useState(5); // Default break duration 5 minutes

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  // Pomodoro timer logic
  useEffect(() => {
    if (isPomodoroActive) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setPomodorosCompleted(pomodorosCompleted + 1);
            // Reset timer to work duration or switch to longer break after 4 pomodoros
            return pomodorosCompleted % 4 === 0 ? breakDuration * 60 : workDuration * 60;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPomodoroActive, pomodorosCompleted, workDuration, breakDuration]);

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

  // Function to refresh (reset) the timer
  const resetPomodoro = () => {
    setTimeLeft(workDuration * 60); // Reset to work duration in seconds
    setIsPomodoroActive(false); // Pause timer if clicked again
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      {/* Dark Mode Emoji Toggle Top-Right */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="toggle-mode"
        style={{ position: "absolute", top: 20, right: 20, fontSize: "24px", background: "none", border: "none" }}
      >
        {darkMode ? "🌙" : "🌞"}
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

      {/* Pomodoro Timer */}
      <div className="pomodoro-timer">
        <p>
          {`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60}`}
        </p>
        <button onClick={() => setIsPomodoroActive(!isPomodoroActive)}>
          {isPomodoroActive ? "Pause Pomodoro" : "Start Pomodoro"}
        </button>

        {/* Show refresh button when Pomodoro is running */}
        {isPomodoroActive && (
          <button onClick={resetPomodoro} style={{ marginLeft: "10px", backgroundColor: "#ffcc00" }}>
            Refresh
          </button>
        )}

        {/* User Custom Time Inputs */}
        <div className="pomodoro-settings">
          <div>
            <label>Work Time (minutes):</label>
            <input
              type="number"
              value={workDuration}
              onChange={(e) => setWorkDuration(Number(e.target.value))}
              min="1"
            />
          </div>
          <div>
            <label>Break Time (minutes):</label>
            <input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Clear Dropdown Button */}
      <div className="clear-btn-wrapper">
        <button
          className="clear-btn"
          onClick={(e) => {
            e.stopPropagation(); // Prevent auto-close when clicked
            setShowClearOptions(!showClearOptions);
          }}
        >
          Clear <span>▼</span>
        </button>

        {/* Clear Options */}
        {showClearOptions && (
          <div className="clear-options">
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearCompleted();
              }}
            >
              Clear Completed
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Task Input */}
      <TaskInput input={input} setInput={setInput} category={category} setCategory={setCategory} addTask={addTask} />

      {/* Task List */}
      <TaskList tasks={filteredTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
}

export default App;