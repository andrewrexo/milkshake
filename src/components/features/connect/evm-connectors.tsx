import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useLocalStorage } from "@solana/wallet-adapter-react";
import { twMerge } from "tailwind-merge";
import type { Connector } from "wagmi";
import { useConnect, useDisconnect } from "wagmi";
import { Badge } from "../../ui/badge";
import Icon from "./icon";

type EVMConnectorsProps = {
  isConnected: boolean;
  onConnect: (connector: Connector) => void;
  evmConnector?: string;
};

export const ConnectorButton = ({
  connector,
  isConnected,
  onConnect,
  network,
}: { connector: Connector; isConnected: boolean; onConnect: (connector: Connector) => void; network: string }) => {
  return (
    <button
      key={connector.uid}
      type="button"
      onClick={() => onConnect(connector)}
      className={twMerge(
        "btn-primary text-md py-4 flex items-center gap-2 w-full",
        isConnected && "opacity-50 cursor-not-allowed",
        !isConnected && "hover-input",
      )}
      disabled={isConnected}
    >
      <div className="flex items-center gap-2 font-medium">
        <Icon connector={connector} className="w-6 h-6" />
        <div className="flex items-center gap-1">{connector.name}</div>
      </div>
      {isConnected && <CheckIcon className="w-6 h-6 ml-auto" />}
      <Badge className={twMerge(isConnected ? "" : "ml-auto")}>{network}</Badge>
    </button>
  );
};

const EVMConnectors = ({ isConnected, onConnect, evmConnector }: EVMConnectorsProps) => {
  const { connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [walletName] = useLocalStorage("walletName", "EVM");

  const uniqueConnectors = connectors.filter(
    (connector, index, self) =>
      index === self.findIndex((t) => t.name === connector.name && connector.name !== walletName),
  );

  if (isConnected && evmConnector) {
    return (
      <div className="flex gap-2 w-full">
        <ConnectorButton
          // biome-ignore lint/style/noNonNullAssertion: connectors always contain the evmConnector
          connector={connectors.find((connector) => connector.name === evmConnector)!}
          isConnected={isConnected}
          onConnect={onConnect}
          network="EVM"
        />
        <button type="button" onClick={() => disconnect()} className="mr-2">
          <Cross1Icon />
        </button>
      </div>
    );
  }

  return uniqueConnectors.map((connector: Connector) => (
    <ConnectorButton
      key={connector.name}
      connector={connector}
      isConnected={isConnected}
      onConnect={onConnect}
      network="EVM"
    />
  ));
};

export default EVMConnectors;
