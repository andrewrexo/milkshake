import { useTheme } from "../../themes/context";
import { themes, type ThemeName } from "../../themes";
import { useEffect } from "react";

const ThemeSelect = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const themeNames = Object.keys(themes) as ThemeName[];
      const index = parseInt(event.key) - 1;
      if (index >= 0 && index < themeNames.length) {
        setTheme(themeNames[index]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setTheme]);

  return (
    <div className="flex space-x-2">
      {Object.keys(themes).map((themeName) => (
        <button
          key={themeName}
          onClick={() => setTheme(themeName as ThemeName)}
          className={`px-4 py-2 rounded ${
            theme === themeName
              ? "bg-primary text-background"
              : "bg-secondary text-text"
          }`}
        >
          {themeName}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelect;
