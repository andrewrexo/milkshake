import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useCallback, useState, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useWalletConnections } from "../../../hooks/useWalletConnections";
import { useAppStore } from "../../../store/useAppStore";
import EVMConnectors from "./evm-connectors";
import { search } from "./search";
import SolanaConnector from "./solana-connector";
import StartButton from "./start-button";

const ConnectContent = () => {
  const { setCurrentPage } = useAppStore();
  const { isEVMConnected, isSolanaConnected, connectEVM, connectSolana, evmConnector } = useWalletConnections();
  const [searchTerm, setSearchTerm] = useState("");

  const handleStartSwapping = useCallback(() => {
    setCurrentPage("swap");
  }, [setCurrentPage]);

  const {
    showEVMConnectors,
    showSolanaConnector,
    anyNetworkFound = true,
  } = useMemo(() => search(searchTerm), [searchTerm]);

  const memoizedEVMConnectors = useMemo(
    () => <EVMConnectors evmConnector={evmConnector?.name} isConnected={isEVMConnected} onConnect={connectEVM} />,
    [evmConnector, isEVMConnected, connectEVM],
  );

  const memoizedSolanaConnector = useMemo(
    () => <SolanaConnector isConnected={isSolanaConnected} onConnect={connectSolana} />,
    [isSolanaConnected, connectSolana],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search networks..."
            className="w-full py-4 pl-4 pr-10 text-md bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
        </div>
      </div>
      {anyNetworkFound ? (
        <div className="grid grid-cols-1 gap-2 rounded-lg">
          {showEVMConnectors && memoizedEVMConnectors}
          {showSolanaConnector && memoizedSolanaConnector}
        </div>
      ) : (
        <div className="text-center text-muted mt-8">No networks found matching your search.</div>
      )}
      {anyNetworkFound && <Divider />}
      <div className={twMerge("mt-auto mb-2 sm:mt-0", !anyNetworkFound && "sm:mt-auto sm:mb-20")}>
        <StartButton
          isEVMConnected={isEVMConnected}
          isSolanaConnected={isSolanaConnected}
          onClick={handleStartSwapping}
        />
      </div>
    </div>
  );
};

const Divider = () => (
  <div className="mt-4 pb-4 items-center hidden sm:flex">
    <div className="flex-grow border-t border-muted" />
    <span className="mx-4 text-sm text-muted">or</span>
    <div className="flex-grow border-t border-muted" />
  </div>
);

export default React.memo(ConnectContent);
