import React from 'react';
import Task from '../Task/Tasks';
import Productivity from '../Productivity/Productivity';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-rows-2 gap-6 p-6">
      {/* Task Card */}
      <div className="bg-gray-200 dark:bg-indigo-950 p-6 rounded-lg shadow-md dark:text-white transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Task</h2>
        <Task />
      </div>

      {/* Productivity Card */}
      <div className="bg-gray-200 dark:bg-fuchsia-950 p-6 rounded-lg shadow-md dark:text-white transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Productivity</h2>
        <Productivity />
      </div>
    </div>
  );
}

export default Dashboard;
