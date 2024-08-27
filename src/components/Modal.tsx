import React, { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="modal-content">
            <Dialog.Title className="text-2xl font-bold mb-6 text-center">
              {title}
            </Dialog.Title>

            {children}

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark"
                aria-label="Close"
              >
                <Cross1Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
