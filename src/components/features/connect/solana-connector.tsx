import { Cross1Icon } from "@radix-ui/react-icons";
import { type Wallet, useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import type { Connector } from "@wagmi/core";
import { ConnectorButton } from "./evm-connectors";

type SolanaConnectorProps = {
  isConnected: boolean;
  onConnect: () => void;
  wallet: Wallet | null;
};

const SolanaConnector = ({ isConnected, onConnect, wallet }: SolanaConnectorProps) => {
  const [walletName] = useLocalStorage<string>("walletName", wallet?.adapter?.name ?? "Solana");
  const { disconnect } = useWallet();

  const connector: Partial<Connector> = {
    name: walletName,
    uid: "solana",
    adapter: {
      name: walletName,
      connect: () => onConnect(),
    },
  };

  return (
    <div className="flex gap-2 w-full">
      <ConnectorButton
        connector={connector as Connector}
        isConnected={isConnected}
        onConnect={onConnect}
        network="SOL"
      />
      {isConnected && (
        <button type="button" onClick={disconnect} className="mr-2">
          <Cross1Icon />
        </button>
      )}
    </div>
  );
};

export default SolanaConnector;
