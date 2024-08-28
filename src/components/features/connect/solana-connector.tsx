import { CheckIcon } from "@radix-ui/react-icons";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { twMerge } from "tailwind-merge";
import Icon from "./icon";

type SolanaConnectorProps = {
  isConnected: boolean;
  onConnect: () => void;
};

const SolanaConnector = ({ isConnected, onConnect }: SolanaConnectorProps) => {
  const { wallet } = useWallet();
  const [walletName] = useLocalStorage<string>("walletName", wallet?.adapter?.name ?? "");

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
      <div className="flex items-center gap-2">
        <Icon connector={{ name: "Solana" }} />
        <span className="font-medium">
          {walletName ? `${wallet?.adapter.name.concat(" (SOL)") ?? "Solana"}` : "Solana"}
        </span>
      </div>
      {isConnected && <CheckIcon className="w-6 h-6 ml-auto" />}
    </button>
  );
};

export default SolanaConnector;
