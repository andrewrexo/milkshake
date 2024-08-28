import { useCallback, useState, useMemo } from "react";
import { useWalletConnections } from "../../../hooks/useWalletConnections";
import { useAppStore } from "../../../store/useAppStore";
import EVMConnectors from "./evm-connectors";
import SolanaConnector from "./solana-connector";
import StartButton from "./start-button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { search } from "./search";

const ConnectContent = () => {
  const { setCurrentPage } = useAppStore();
  const { isEVMConnected, isSolanaConnected, connectEVM, connectSolana } = useWalletConnections();
  const [searchTerm, setSearchTerm] = useState("");

  const handleStartSwapping = useCallback(() => {
    setCurrentPage("swap");
  }, [setCurrentPage]);

  const { showEVMConnectors, showSolanaConnector, anyNetworkFound } = useMemo(() => search(searchTerm), [searchTerm]);

  return (
    <>
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
          {showEVMConnectors && <EVMConnectors isConnected={isEVMConnected} onConnect={connectEVM} />}
          {showSolanaConnector && <SolanaConnector isConnected={isSolanaConnected} onConnect={connectSolana} />}
        </div>
      ) : (
        <div className="text-center pb-8 text-muted">No networks found matching your search.</div>
      )}
      {anyNetworkFound && <Divider />}
      <StartButton
        isEVMConnected={isEVMConnected}
        isSolanaConnected={isSolanaConnected}
        onClick={handleStartSwapping}
      />
    </>
  );
};

const Divider = () => (
  <div className="mt-4 pb-4 flex items-center">
    <div className="flex-grow border-t border-muted" />
    <span className="mx-4 text-sm text-muted">or</span>
    <div className="flex-grow border-t border-muted" />
  </div>
);

export default ConnectContent;
