import { useTheme } from "../../themes/context";
import { themes, type ThemeName } from "../../themes";

const ThemeSelect = () => {
  const { theme, setTheme } = useTheme();

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
