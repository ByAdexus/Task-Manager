import TaskItem from './TaskItem';

function TaskSection({ title, tasks }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="bg-white shadow rounded p-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TaskSection;
