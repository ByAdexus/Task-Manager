import React, { useState } from 'react';
import { useDarkMode } from '../../services/DarkMode';

function Settings() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [visible, setVisible] = useState(true);

  const clearCacheHandler = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage("clearCache");
    }
  };


  const wipeAllData = async () => {
    try {
      const response = await fetch(`${"https://task-magnament-default-rtdb.firebaseio.com/"}.json`, {
        method: "DELETE", // HTTP DELETE request
      });
  
      if (response.ok) {
        alert("All data has been wiped out from the database!");
      } else {
        alert("Error while wiping data from the database.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };



  return (
    <div
className='flex p-6 space-x-4 ml-64'
    >
      <button
        className="p-2 rounded bg-gray-200 dark:bg-gray-700"
        onClick={toggleDarkMode}
      >
        {isDarkMode ? '☀ Light Mode' : '🌑 Dark Mode'}
      </button>
      <button
        className="p-2 rounded bg-gray-200 dark:bg-gray-700"
        onClick={clearCacheHandler}
      >
        Limpiar Cache
      </button>



      <button
        onClick={() => wipeAllData()}
        className="bg-red-400 text-white p-2  rounded shadow-lg hover:bg-red-600"
      >
        Wipe All Data
      </button>
    </div>



  );
}

export default Settings;
