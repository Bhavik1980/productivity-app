function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <li
      style={{
        textDecoration: task.completed ? "line-through" : "none",
        marginBottom: 8,
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={() => toggleTask(task.id)}
    >
      <div>
        <strong>{task.text}</strong> <span>({task.category})</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;