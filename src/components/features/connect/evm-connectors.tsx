import { CheckIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import type { Connector } from "wagmi";
import { useConnect } from "wagmi";
import Icon from "./icon";
import { useTheme } from "../../../themes/context";

type EVMConnectorsProps = {
  isConnected: boolean;
  onConnect: (connector: Connector) => void;
};

const EVMConnectors = ({ isConnected, onConnect }: EVMConnectorsProps) => {
  const { connectors } = useConnect();
  const { mode } = useTheme();

  const uniqueConnectors = connectors.filter(
    (connector, index, self) => index === self.findIndex((t) => t.name === connector.name),
  );

  return (
    <>
      {uniqueConnectors.map((connector: Connector) => (
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
            <Icon connector={connector} className="w-6 h-6" />
            <div className="flex items-center gap-1">{connector.name}</div>
          </div>
          {isConnected && <CheckIcon className="w-6 h-6 ml-auto" />}
          <span
            className={twMerge(
              "bg-secondary px-2 py-1 rounded-full text-xs text-text font-bold",
              isConnected ? "" : "ml-auto",
              mode === "dark" ? "text-input" : "text-input",
            )}
          >
            EVM
          </span>
        </button>
      ))}
    </>
  );
};

export default EVMConnectors;
