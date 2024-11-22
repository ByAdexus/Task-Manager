import React, { useState } from 'react';
import { useDarkMode } from '../../services/DarkMode';

function Settings() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [visible, setVisible] = useState(true);

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
    </div>
  );
}

export default Settings;
