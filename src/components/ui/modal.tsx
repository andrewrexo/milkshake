import { Cross2Icon } from "@radix-ui/react-icons";
import type React from "react";
import { useEffect } from "react";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, title, children }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isVisible, onClose]);

  return (
    <div
      className={`absolute h-full inset-0 bg-surface z-10 flex flex-col transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center py-4 px-2 border-b border-border">
        <h2 className="text-xl font-bold">{title}</h2>
        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-input">
          <Cross2Icon className="w-5 h-5" />
        </button>
      </div>
      <div className="px-2 py-4 h-full">{children}</div>
    </div>
  );
};

export default Modal;
