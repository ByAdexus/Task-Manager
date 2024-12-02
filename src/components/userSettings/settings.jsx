import React, { useState } from 'react';
import { useDarkMode } from '../../services/DarkMode';

function Settings() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [visible, setVisible] = useState(true);




  //delete later:
  const logAllCacheData = async () => {
    const cacheNames = await caches.keys(); // Get all cache names
    //console.log("Cache Names:", cacheNames);  // Log all cache names
  
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys(); // Get all request keys in the cache
      
      //console.log(`Cache: ${cacheName}`);
      
      // Log each cached request and its corresponding data
      for (const request of requests) {
        const response = await cache.match(request);  // Get data for the request
        const data = await response.json();  // Assuming data is stored as JSON
        //console.log(`Key: ${request.url} - Data:`, data);
      }
    }
  };
  
  // Call the function to log all cache data
  logAllCacheData();


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
