import { CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="absolute sm:bottom-0 sm:top-12 bottom-4 left-0 right-0 z-50 flex flex-col items-center space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast: React.FC<Toast> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a small delay before setting isVisible to true for the fade-in effect
    const showTimer = setTimeout(() => setIsVisible(true), 50);
    const hideTimer = setTimeout(() => setIsVisible(false), 2700);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const icon = {
    success: <CheckCircledIcon className="w-6 h-6 text-green-500" />,
    error: <CrossCircledIcon className="w-6 h-6 text-red-500" />,
    info: <InfoCircledIcon className="w-6 h-6 text-blue-500" />,
  }[type];

  return (
    <div
      className={twMerge(
        "flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md bg-surface max-w-[90%] transition-all duration-400 ease-in-out transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
        type === "success" && "border border-green-400",
        type === "error" && "border border-red-400",
        type === "info" && "border border-blue-400",
      )}
    >
      {icon}
      <span className="text-sm whitespace-pre-line">{message.replace(/\\n/g, "\n")}</span>
    </div>
  );
};
