import React from 'react';

function TaskInput({ input, setInput, category, setCategory, addTask }) {
  return (
    <div className="task-input-wrapper">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask();
        }}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Work</option>
        <option>Study</option>
        <option>Personal</option>
      </select>
      <button onClick={addTask} disabled={!input.trim()}>
        Add Task
      </button>
    </div>
  );
}

export default TaskInput;  // Default export added here