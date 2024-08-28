import { useState, useEffect } from "react";
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
  const currentPage = useAppStore((state) => state.currentPage);
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
    <div className="widget relative overflow-hidden min-h-[500px] pb-8">
      <div data-status={transitionStatus} className="h-full">
        <PageComponent />
      </div>
      <p className="mt-auto text-center text-xs text-muted">
        powered by milkshake.ai
      </p>
    </div>
  );
};

export default Widget;
