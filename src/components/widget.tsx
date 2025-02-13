import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "../store/useAppStore";
import { solanaEndpoint } from "../solana";
import Connect from "./features/connect";
import Transfers from "./features/transfers";
import { ToastProvider } from "./ui/toast";

// Import Solana wallet styles
import "@solana/wallet-adapter-react-ui/styles.css";

const pages = {
  connect: Connect,
  dashboard: Connect,
  swap: Transfers,
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
    <WalletProvider wallets={wallets} autoConnect onError={(error) => console.log(error)}>
      <ConnectionProvider endpoint={solanaEndpoint}>
        <WalletModalProvider>
          <div className="widget flex flex-col overflow-hidden h-full sm:h-auto sm:min-h-[600px] w-full max-w-[500px] relative">
            <ToastProvider>
              <div data-status={transitionStatus} className="h-full flex-grow flex flex-col justify-between">
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
            </ToastProvider>
          </div>
        </WalletModalProvider>
      </ConnectionProvider>
    </WalletProvider>
  );
};

export default Widget;
