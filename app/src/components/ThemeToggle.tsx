import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check user's preferred color scheme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    // Apply the selected theme to the HTML element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    // Toggle between dark and light themes
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
      <button
        className="bg-sky-500 hover:bg-sky-400 text-white text-sm rounded-lg p-2.5 mr-1 text-center"
        onClick={handleThemeSwitch}
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
  );
};

export default ThemeToggle;
