import { twMerge } from "tailwind-merge";
import { useTheme } from "../../themes/context";

export const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { mode } = useTheme();
  return (
    <span
      className={twMerge(
        "bg-primary px-2 py-1 rounded-full text-xs text-text font-bold",
        mode === "dark" ? "text-input" : "text-input",
        className,
      )}
    >
      {children}
    </span>
  );
};
