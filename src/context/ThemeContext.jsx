import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [font, setFont] = useState(
    localStorage.getItem("user-font") || "font-inter",
  );

  useEffect(() => {
    document.documentElement.className = `${theme} ${font}`;
    localStorage.setItem("theme", theme);
    localStorage.setItem("user-font", font);
  }, [theme, font]);

  const toggleTheme = () => {
    setTheme((oldTheme) => (oldTheme === "light" ? "dark" : "light"));
  };

  const changeFont = (newFont) => {
    setFont(newFont);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, font, changeFont }}>
      {children}
    </ThemeContext.Provider>
  );
}
