import React from 'react';

function TaskCard({ task }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center mb-4 transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl">
      <div className="flex flex-col">
        <span className="font-medium text-gray-800 text-lg">{task.title}</span>
        {/* Descripción opcional debajo del título */}
        {task.description && <p className="text-sm text-gray-600 mt-2">{task.description}</p>}
      </div>
      
      <div className="flex space-x-2">
        <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full">
          <i className="pi pi-pencil"></i> {/* Edit Icon */}
        </button>
        <button className="text-red-500 hover:text-red-700 p-2 rounded-full">
          <i className="pi pi-trash"></i> {/* Delete Icon */}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
