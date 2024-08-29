import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "../store/useAppStore";
import { solanaEndpoint } from "../wagmi";
import Connect from "./features/connect";
import Swap from "./features/swap";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// Import Solana wallet styles
import "@solana/wallet-adapter-react-ui/styles.css";

const pages = {
  connect: Connect,
  dashboard: Connect,
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
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [transitionStatus]);

  const PageComponent = pages[displayedPage];

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={solanaEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="widget flex flex-col overflow-hidden min-h-full sm:min-h-[530px]">
            <div data-status={transitionStatus} className="h-full flex flex-col justify-between">
              <PageComponent />
            </div>
            <p
              className={twMerge(
                "text-center text-xs text-muted z-0 transition-opacity duration-300 select-none pointer-events-none mt-auto",
                showModal ? "opacity-0" : "opacity-100",
              )}
            >
              powered by milkshake.ai
            </p>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Widget;
