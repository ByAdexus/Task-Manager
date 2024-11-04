function TaskItem({ task }) {
    return (
      <div className="flex items-center justify-between p-2 border-b last:border-0">
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>{task.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{task.dueDate}</span>
          <span className={`badge ${task.stage.toLowerCase()}`}>{task.stage}</span>
          <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
          <span>{task.team}</span>
          <span>{task.assignee}</span>
        </div>
      </div>
    );
  }
  
  export default TaskItem;
  