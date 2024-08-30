import { HamburgerMenuIcon, LoopIcon, ShuffleIcon } from "@radix-ui/react-icons";
import { useDisconnect } from "wagmi";
import { useAppStore } from "../../../store/useAppStore";
import NetworkIcon from "../../icons/network";
import { Assets } from "./assets";

const Dashboard = () => {
  const { disconnect } = useDisconnect();
  const { setConnected, setCurrentPage, selectedNetwork } = useAppStore();

  const handleDisconnect = () => {
    disconnect();
    setConnected(false);
    setCurrentPage("connect");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="mr-2 flex items-center">
            <span className="bg-background rounded-full p-1 mt-[2px]">
              <NetworkIcon iconName={selectedNetwork?.id || "ethereum"} width={32} height={32} />
            </span>
          </span>
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-bold">Oxbc...38FA</h2>
            <button onClick={handleDisconnect} className="text-xs text-muted hover:text-primary" type="button">
              Disconnect
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <button className="btn-primary flex items-center justify-center py-3" type="button">
            <HamburgerMenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="text-sm font-medium mb-1">Balance:</h3>
        <p className="text-2xl font-bold">$0.00</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          className="btn-primary flex items-center justify-center py-3"
          onClick={() => setCurrentPage("swap")}
          type="button"
        >
          <span className="mr-2">
            <ShuffleIcon className="w-4 h-4" />
          </span>
          Swap
        </button>
        <button
          className="btn-primary flex items-center justify-center py-3"
          onClick={() => setCurrentPage("swap")}
          type="button"
        >
          <span className="mr-2">
            <LoopIcon className="w-4 h-4" />
          </span>
          Bridge
        </button>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">My chains</h3>
        <button className="text-sm text-primary hover:underline" type="button">
          + Link a new chain
        </button>
      </div>

      <div className="bg-input rounded-lg p-4 mb-4 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-muted">Link additional chains to see them here.</p>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">My balances</h3>
      </div>
      <Assets />
    </div>
  );
};

export default Dashboard;
