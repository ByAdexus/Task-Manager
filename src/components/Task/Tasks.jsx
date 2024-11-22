import React from 'react';

const Task = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center relative z-10">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="text-center p-4 bg-white rounded shadow-lg">
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-lg">Esta es la vista de tareas.</p>
        </div>
      </div>
    </div>
  );
};

export default Task;
