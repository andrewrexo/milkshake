import { create } from "zustand";

type AppState = {
  isConnected: boolean;
  currentPage: "connect" | "dashboard";
  setConnected: (connected: boolean) => void;
  setCurrentPage: (page: "connect" | "dashboard") => void;
};

export const useAppStore = create<AppState>((set) => ({
  isConnected: false,
  currentPage: "connect",
  setConnected: (connected) => set({ isConnected: connected }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
