import React from 'react';
import TaskCard from '../TaskCard/TaskCard';

function ProjectColumn({ title, tasks }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg w-64 p-4 shadow">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default ProjectColumn;
