import type React from "react";
import { useState, useCallback } from "react";
import { ArchiveIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "../../../store/useAppStore";
import Swap from "../swap";
import Bridge from "../bridge";

type TabType = "transfer" | "bridge";

const Transfers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("transfer");
  const { setCurrentPage } = useAppStore();

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setCurrentPage("dashboard")} className="text-2xl font-bold">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex gap-4 relative">
          <span
            className={`absolute inset-0 bg-background rounded-lg transition-transform duration-300 ease-in-out ${
              activeTab === "transfer" ? "transform translate-x-0" : "transform translate-x-full"
            }`}
            style={{ width: "50%", left: activeTab === "transfer" ? "-1%" : "3%" }}
          />
          <button
            type="button"
            onClick={() => handleTabChange("transfer")}
            className={`px-4 py-2 font-medium rounded-lg relative z-10 hover:text-hover active:text-hover transition-colors duration-300 flex-1 ${activeTab === "transfer" ? "text-text" : "text-primary"}`}
          >
            Transfer
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("bridge")}
            className={`px-4 py-2 rounded-lg font-medium relative z-10 hover:text-hover active:text-hover transition-colors duration-300 flex-1 ${activeTab === "bridge" ? "text-text" : "text-primary"}`}
          >
            Bridge
          </button>
        </div>
        <div className="flex space-x-2">
          <button type="button" className="p-2 rounded-full hover:bg-input">
            <ArchiveIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className={twMerge(
          "transition-opacity duration-300 ease-in-out h-full pb-4",
          activeTab === "transfer" ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none",
        )}
      >
        {activeTab === "transfer" && <Swap />}
      </div>

      <div
        className={twMerge(
          "transition-opacity duration-300 ease-in-out h-full pb-4",
          activeTab === "bridge" ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none",
        )}
      >
        {activeTab === "bridge" && <Bridge />}
      </div>
    </div>
  );
};

export default Transfers;
