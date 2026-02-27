import TaskItem from "./TaskItem";

function TaskList({ tasks, toggleTask, deleteTask }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Stay productive.</p>;
  }

  return (
    <ul>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
      ))}
    </ul>
  );
}

export default TaskList;