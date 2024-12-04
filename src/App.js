import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Productivity from "./components/Productivity/Productivity.jsx";
import Task from "./components/Task/Tasks.jsx";
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.jsx";
import { DarkMode } from "./services/DarkMode.js";
import Settings from "./components/userSettings/settings.jsx";
import { getAllUsers } from "./services/storageService"; // Assuming this gets all users
import { getOrGenerateSeed } from "./services/storageService.js";
import { FirebaseProvider } from "./services/FirebaseContext.js";

function App() {
  const [users, setUsers] = useState([]);
  const [seed, setSeed] = useState(null);

  // Load users and seed data on mount
  useEffect(() => {
    const loadData = async () => {
      // Load users and seed
      const loadedUsers = await getAllUsers();
      setUsers(loadedUsers);

      // Optionally handle seed here if needed, or leave it for KanbanBoard to generate
      const resolvedSeed = await getOrGenerateSeed();
      setSeed(resolvedSeed);
    };

    loadData();
  }, []);

  return (
    <DarkMode>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <FirebaseProvider>
          <Router>
            <div className="min-w-max bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
              <Header />
              <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
                <Sidebar />
                <div className="flex-grow p-4 min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks" element={<Task />} />
                    <Route path="/productivity" element={<Productivity />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/kanban" element={<KanbanBoard />} />
                  </Routes>
                </div>
              </div>
            </div>
          </Router>
        </FirebaseProvider>
      </div>
    </DarkMode>
  );
}

export default App;
