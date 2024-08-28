import { useCallback } from "react";
import { useWalletConnections } from "../../../hooks/useWalletConnections";
import { useAppStore } from "../../../store/useAppStore";
import EVMConnectors from "./evm-connectors";
import Networks from "./networks";
import SolanaConnector from "./solana-connector";
import StartButton from "./start-button";

const ConnectContent = () => {
  const { setCurrentPage } = useAppStore();
  const { isEVMConnected, isSolanaConnected, connectEVM, connectSolana } = useWalletConnections();

  const handleStartSwapping = useCallback(() => {
    setCurrentPage("swap");
  }, [setCurrentPage]);

  return (
    <>
      <Networks />
      <div className="grid grid-cols-1 gap-2 rounded-lg">
        <EVMConnectors isConnected={isEVMConnected} onConnect={connectEVM} />
        <SolanaConnector isConnected={isSolanaConnected} onConnect={connectSolana} />
      </div>
      <Divider />
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
