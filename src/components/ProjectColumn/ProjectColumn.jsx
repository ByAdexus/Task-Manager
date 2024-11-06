import React from 'react';
import TaskCard from './TaskCard'; // Asegúrate de que esté bien importado

function ProjectColumn({ title, tasks }) {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg w-80 p-4 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <h2 className="font-bold text-xl text-gray-700 mb-4">{title}</h2>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default ProjectColumn;
