import React, { createContext, useContext, useState, useEffect } from "react";

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [firebaseUrl, setFirebaseUrl] = useState(
    "https://task-magnament-default-rtdb.firebaseio.com"
  );
  const [seed, setSeed] = useState(() => {
    // Retrieve the seed from localStorage or initialize to null
    return localStorage.getItem('seed') || null;
  });

  useEffect(() => {
    // Save the seed to localStorage whenever it changes
    if (seed) {
      localStorage.setItem('seed', seed);
    }
  }, [seed]);

  return (
    <FirebaseContext.Provider value={{ firebaseUrl, seed, setSeed }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseContext = () => {
  return useContext(FirebaseContext);
};