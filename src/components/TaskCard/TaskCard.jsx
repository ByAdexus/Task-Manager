import React from 'react';

function TaskCard({ task }) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-2 shadow hover:bg-gray-200 transition duration-200">
      <h3 className="font-semibold">{task.name}</h3>
      <p>Due: {task.dueDate}</p>
      <p>Priority: {task.priority}</p>
      <div className="flex justify-between mt-2">
        <button className="text-blue-500">Edit</button>
        <button className="text-green-500">Complete</button>
      </div>
    </div>
  );
}

export default TaskCard;
