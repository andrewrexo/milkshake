import { CheckIcon } from "@radix-ui/react-icons";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { twMerge } from "tailwind-merge";
import Icon from "./icon";
import { useTheme } from "../../../themes/context";

type SolanaConnectorProps = {
  isConnected: boolean;
  onConnect: () => void;
};

const SolanaConnector = ({ isConnected, onConnect }: SolanaConnectorProps) => {
  const { wallet } = useWallet();
  const [walletName] = useLocalStorage<string>("walletName", wallet?.adapter?.name ?? "");
  const { mode } = useTheme();

  return (
    <button
      type="button"
      onClick={onConnect}
      className={twMerge(
        "btn-primary text-md py-4 flex items-center gap-2 duration-300 transition-all",
        !isConnected && "hover-input",
        isConnected && "opacity-50 cursor-not-allowed",
      )}
      disabled={isConnected}
    >
      <div className="flex items-center gap-2 font-medium">
        <Icon connector={{ name: "Solana" }} />
        <div className="flex items-center gap-1">{walletName ? `${wallet?.adapter.name ?? "Solana"}` : "Solana"}</div>
      </div>
      {isConnected && <CheckIcon className="w-6 h-6 ml-auto" />}
      <span
        className={twMerge(
          "bg-primary px-2 py-1 rounded-full text-xs text-text font-bold",
          isConnected ? "" : "ml-auto",
          mode === "dark" ? "text-input" : "text-input",
        )}
      >
        SOL
      </span>
    </button>
  );
};

export default SolanaConnector;
