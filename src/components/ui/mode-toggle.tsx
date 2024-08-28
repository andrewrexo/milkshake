import type React from "react";
import { useTheme } from "../../themes/context";

const ModeToggle: React.FC = () => {
  const { mode, setMode } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
      className="px-4 py-2 bg-primary text-background rounded-lg"
    >
      {mode === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ModeToggle;
