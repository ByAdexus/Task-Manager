import React, { createContext, useContext, useState } from "react";

const FirebaseContext = createContext();

export const useFirebaseContext = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
  const [firebaseUrl, setFirebaseUrl] = useState("https://task-magnament-default-rtdb.firebaseio.com"); 
  const [seed, setSeed] = useState();

  return (
    <FirebaseContext.Provider value={{ firebaseUrl, setFirebaseUrl, seed, setSeed }}>
      {children}
    </FirebaseContext.Provider>
  );
};
