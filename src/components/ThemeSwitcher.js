"use client";

import { useTheme } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 items-center">
      <span>Current: {theme}</span>
      <button
        onClick={() => setTheme(theme === "light" ? "aqua" : "light")}
        data-theme={theme}
        className="btn btn-primary"
      >
        Switch Theme
      </button>
    </div>
  );
};

export default ThemeSwitcher;
