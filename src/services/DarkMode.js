import React, { createContext, useState, useEffect, useContext } from 'react';
import { storeInCache, getFromCache } from './cacheUtils'; // Adjust path if necessary

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkMode = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default mode

  useEffect(() => {
    // Load dark mode preference from cache on mount
    const loadDarkMode = async () => {
      const cachedMode = await getFromCache('dark-mode');
      if (cachedMode !== null) {
        setIsDarkMode(cachedMode);
        document.documentElement.classList.toggle('dark', cachedMode);
      }
    };
    loadDarkMode();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    await storeInCache('dark-mode', newMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
