import { Cross1Icon } from "@radix-ui/react-icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectorButton } from "./evm-connectors";

type SolanaConnectorProps = {
  isConnected: boolean;
  onConnect: () => void;
};

const SolanaConnector = ({ isConnected, onConnect }: SolanaConnectorProps) => {
  const { disconnect } = useWallet();

  return (
    <div className="flex gap-2 w-full">
      <ConnectorButton isConnected={isConnected} onConnect={onConnect} network="Solana" badge="SOL" />
      {isConnected && (
        <button type="button" onClick={disconnect} className="mr-2">
          <Cross1Icon />
        </button>
      )}
    </div>
  );
};

export default SolanaConnector;
