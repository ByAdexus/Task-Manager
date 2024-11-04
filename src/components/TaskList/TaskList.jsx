import TaskSection from './TaskSection'; // Asegúrate de importar TaskSection

function TaskList() {
  const tasksToday = [
    { id: 1, name: 'Task 1', dueDate: '2024-11-01', stage: 'In Progress', priority: 'High', team: 'Team A', assignee: 'User 1' },
  ];
  
  const tasksTomorrow = [
    { id: 2, name: 'Task 2', dueDate: '2024-11-02', stage: 'Completed', priority: 'Medium', team: 'Team B', assignee: 'User 2' },
  ];

  const tasksThisWeek = [
    { id: 3, name: 'Task 3', dueDate: '2024-11-03', stage: 'Pending', priority: 'Low', team: 'Team C', assignee: 'User 3' },
  ];

  return (
    <div className="space-y-4"> {/* Espaciado vertical entre secciones */}
      <TaskSection title="Hoy" tasks={tasksToday} />
      <TaskSection title="Mañana" tasks={tasksTomorrow} />
      <TaskSection title="Esta semana" tasks={tasksThisWeek} />
    </div>
  );
}

export default TaskList;
