import React from 'react';
import TaskSection from './TaskSection'; // Asegúrate de importar TaskSection si lo usas

function TaskList() {
  const tasks = [
    { id: 1, name: 'Task 1', dueDate: '2024-11-01', stage: 'In Progress', priority: 'High', team: 'Team A', assignee: 'User 1' },
    { id: 2, name: 'Task 2', dueDate: '2024-11-02', stage: 'Completed', priority: 'Medium', team: 'Team B', assignee: 'User 2' },
  ];

  return (
    <div>
      <TaskSection title="My Tasks" tasks={tasks} />
    </div>
  );
}

export default TaskList; // Asegúrate de que esta línea esté presente
