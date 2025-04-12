"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // default theme

  const [brandColor, setBrandColor] = useState("text-orange-500");

  useEffect(() => {
    const themeBrandMap = {
      dark: "text-orange-500",
      light: "text-orange-500",
      synthwave: "text-white",
      cyberpunk: "text-black",
      forest: "text-green-600",
      luxury: "text-yellow-600",
      dracula: "text-purple-400",
      halloween: "text-orange-400",
      night: "text-blue-400",
    };

    setBrandColor(themeBrandMap[theme] );
  }, [theme]);


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme,brandColor,setBrandColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
