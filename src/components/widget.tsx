import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "../store/useAppStore";
import Connect from "./features/connect";
import Dashboard from "./features/dashboard";
import Swap from "./features/swap";

const pages = {
  connect: Connect,
  dashboard: Dashboard,
  swap: Swap,
};

const Widget = () => {
  const { currentPage, showModal } = useAppStore((state) => ({
    currentPage: state.currentPage,
    showModal: state.showModal,
  }));

  const [displayedPage, setDisplayedPage] = useState(currentPage);
  const [transitionStatus, setTransitionStatus] = useState("entered");

  useEffect(() => {
    if (currentPage !== displayedPage) {
      setTransitionStatus("exiting");

      const timer = setTimeout(() => {
        setDisplayedPage(currentPage);
        setTransitionStatus("entering");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentPage, displayedPage]);

  useEffect(() => {
    if (transitionStatus === "entering") {
      const timer = setTimeout(() => {
        setTransitionStatus("entered");
      }, 50); // Small delay to trigger the entering animation

      return () => clearTimeout(timer);
    }
  }, [transitionStatus]);

  const PageComponent = pages[displayedPage];

  return (
    <div className="widget flex flex-col overflow-hidden min-h-[530px]">
      <div data-status={transitionStatus} className="h-full flex flex-col justify-between">
        <PageComponent />
      </div>
      <p
        className={twMerge(
          "text-center text-xs text-muted z-0 transition-opacity duration-300 select-none pointer-events-none",
          showModal ? "opacity-0" : "opacity-100",
        )}
      >
        powered by milkshake.ai
      </p>
    </div>
  );
};

export default Widget;
