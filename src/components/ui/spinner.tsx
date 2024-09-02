import type React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <svg className="w-12 h-12 animate-spin" viewBox="0 0 50 50" aria-hidden="true">
        <title>Loading spinner</title>
        <circle
          className="stroke-primary"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="80, 200"
        />
      </svg>
    </div>
  );
};

export default Spinner;
