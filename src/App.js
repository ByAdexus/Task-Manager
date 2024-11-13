import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Productivity from "./components/Productivity/Productivity.jsx";
import Tasks from "./components/Task/Tasks.jsx";
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.jsx";
import { DarkMode } from './services/DarkMode.js';

function App() {
  return (
    <DarkMode>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-grow p-4">
            <Routes >
            <Route path="/" element={<KanbanBoard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/productivity" element={<Productivity />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
    </div>
    </DarkMode>
  );
}

export default App;
