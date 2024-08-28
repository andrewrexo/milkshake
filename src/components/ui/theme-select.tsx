import { useEffect } from "react";
import { type ThemeName, themes } from "../../themes";
import { useTheme } from "../../themes/context";

const ThemeSelect = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) {
        return; // Do not change theme if the event target is an input element
      }
      const themeNames = Object.keys(themes) as ThemeName[];
      const index = Number.parseInt(event.key) - 1;
      if (index >= 0 && index < themeNames.length) {
        setTheme(themeNames[index]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setTheme]);

  return <></>;
};

export default ThemeSelect;
