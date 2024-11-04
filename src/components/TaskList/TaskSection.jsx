function TaskSection({ title, tasks }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {tasks.map(task => (
        <div key={task.id} className="border-b border-gray-200 py-2 last:border-b-0">
          <span>{task.name}</span>
        </div>
      ))}
    </div>
  );
}

export default TaskSection;
