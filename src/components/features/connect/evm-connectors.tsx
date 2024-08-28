import { CheckIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import type { Connector } from "wagmi";
import { useConnect } from "wagmi";
import Icon from "./icon";

type EVMConnectorsProps = {
  isConnected: boolean;
  onConnect: (connector: Connector) => void;
};

const EVMConnectors = ({ isConnected, onConnect }: EVMConnectorsProps) => {
  const { connectors } = useConnect();

  return (
    <>
      {connectors.map((connector: Connector) => (
        <button
          key={connector.uid}
          type="button"
          onClick={() => onConnect(connector)}
          className={twMerge(
            "btn-primary text-md py-4 flex items-center gap-2",
            isConnected && "opacity-50 cursor-not-allowed",
            !isConnected && "hover-input",
          )}
          disabled={isConnected}
        >
          <div className="flex items-center gap-2 font-medium">
            <Icon connector={connector} />
            <div className="flex items-center gap-1">{connector.name}</div>
          </div>
          {isConnected && <CheckIcon className="w-6 h-6 ml-auto" />}
          <span
            className={twMerge("bg-secondary px-2 py-1 rounded-full text-xs text-input", isConnected ? "" : "ml-auto")}
          >
            ETH
          </span>
        </button>
      ))}
    </>
  );
};

export default EVMConnectors;
