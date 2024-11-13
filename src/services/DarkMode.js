// src/contexts/DarkModeContext.js
import React, { createContext, useState, useContext } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkMode = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('dark-mode') === 'true'
  );

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('dark-mode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
