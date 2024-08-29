import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
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
  onDisconnect,
  network,
  badge,
}: {
  connector?: Connector;
  isConnected: boolean;
  onConnect: (connector: Connector) => void;
  onDisconnect?: () => void;
  network: string;
  badge?: string;
}) => {
  let connectorDupe: Partial<Connector | undefined> = connector;

  if (!connectorDupe) {
    connectorDupe = {
      name: `${network} Network${network === "EVM" ? "s" : ""}`,
      uid: network.toLowerCase(),
      adapter: {
        name: `${network} Network`,
        disconnect: () => onDisconnect,
      },
    };
  }

  return (
    <button
      key={connectorDupe.uid}
      type="button"
      onClick={() => (onDisconnect ? onDisconnect() : onConnect(connectorDupe as Connector))}
      className={twMerge(
        "btn-primary text-md py-4 flex items-center gap-2 w-full",
        isConnected && "opacity-50 cursor-not-allowed",
        !isConnected && "hover-input",
      )}
      disabled={isConnected}
    >
      <div className="flex items-center gap-2 font-medium">
        <span className="w-8 h-8 bg-background rounded-full flex items-center justify-center p-1">
          <Icon connector={connectorDupe as Connector} className="w-8 h-8" />
        </span>
        <div className="flex items-center gap-1">{connectorDupe.name}</div>
      </div>
      {isConnected && <CheckIcon className="w-6 h-6 ml-auto" />}
      <Badge className={twMerge(isConnected ? "" : "ml-auto")}>{badge ?? network}</Badge>
    </button>
  );
};

const EVMConnectors = ({ isConnected, onConnect }: EVMConnectorsProps) => {
  const { connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return isConnected ? (
    <div className="flex gap-2 w-full">
      <ConnectorButton
        key={"evm-wallet"}
        isConnected={isConnected}
        onConnect={onConnect}
        onDisconnect={disconnect}
        network="EVM"
      />
      <button
        type="button"
        onClick={() => {
          disconnect();
        }}
        className="mr-2"
      >
        <Cross1Icon />
      </button>
    </div>
  ) : (
    connectors.map((connector: Connector) => (
      <ConnectorButton
        key={connector.name}
        connector={connector}
        isConnected={isConnected}
        onConnect={onConnect}
        network="EVM"
      />
    ))
  );
};

export default EVMConnectors;
