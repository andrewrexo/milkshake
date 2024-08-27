import { useConnect } from "wagmi";
import { WalletIcon as Web3IconsWalletIcon } from "@web3icons/react";
import { CubeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";

const Wallet = ({ connector }: { connector: any }) => {
  const icon = connector.icon;
  const defaultIcon = <CubeIcon className="w-6 h-6" />;

  if (icon) {
    return <img src={icon} alt={connector.name} width={24} height={24} />;
  }

  if (connector.id === "injected") {
    return defaultIcon;
  }

  return <Web3IconsWalletIcon name={connector.name} />;
};

const ConnectWalletWidget = () => {
  const { connectors, connectAsync } = useConnect();

  const handleConnect = async (connector: any) => {
    try {
      await connectAsync({ connector });
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-96 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Log in to milkshake.ai
      </h2>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search wallets across 10+ networks"
            className="input pl-10"
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-light dark:text-secondary-dark" />
        </div>
      </div>

      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => handleConnect(connector)}
            className="w-full flex items-center justify-between bg-surface-light dark:bg-surface-dark hover:bg-background-light dark:hover:bg-background-dark rounded-lg p-3 border border-secondary-light dark:border-secondary-dark transition-colors"
          >
            <div className="flex items-center gap-2">
              <Wallet connector={connector} />
              <span className="font-medium">{connector.name}</span>
            </div>
            <span className="text-sm text-primary-light dark:text-primary-dark"></span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-secondary-light dark:text-secondary-dark">
        Can't find your wallet?{" "}
        <a href="#" className="text-primary-light dark:text-primary-dark">
          Reach out.
        </a>
      </p>

      <p className="mt-4 text-center text-xs text-secondary-light dark:text-secondary-dark">
        milkshake.ai
      </p>
    </div>
  );
};

export default ConnectWalletWidget;
