// src/context/DarkModeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={darkMode ? "dark" : ""}>
        {children}
      </div>
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);