import { CaretDownIcon, CaretUpIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type React from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { mockAssets } from "../../../lib/mock";
import type { Network } from "../../../store/useAppStore";
import NetworkIcon from "../../icons/network";
import TokenIcon from "../../icons/token";
import Modal from "../../ui/modal";
import ScrollArea from "../../ui/scroll-area";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  network: Network;
  balance: string;
}

const networks = ["ethereum", "arbitrum", "polygon", "solana", "bsc"];

interface AssetSelectionProps {
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  isVisible: boolean;
}

const AssetSelection: React.FC<AssetSelectionProps> = ({ onClose, onSelect, isVisible }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [isNetworkSelectorExpanded, setIsNetworkSelectorExpanded] = useState(false);

  const filteredAssets = mockAssets.filter(
    (asset) =>
      (selectedNetworks.includes(asset.network.id) || selectedNetworks.length === 0) &&
      (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.network.name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const toggleNetwork = (network: string) => {
    setSelectedNetworks((prev) => (prev.includes(network) ? prev.filter((n) => n !== network) : [...prev, network]));
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} title="Select Asset">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-secondary"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
      </div>

      <div className="mb-2">
        <button
          onClick={() => setIsNetworkSelectorExpanded(!isNetworkSelectorExpanded)}
          className="flex items-center space-x-2 text-sm text-muted hover:text-text transition-colors duration-200"
          type="button"
        >
          <span>Filter by network</span>
          {isNetworkSelectorExpanded ? <CaretUpIcon className="w-4 h-4" /> : <CaretDownIcon className="w-4 h-4" />}
        </button>
        {isNetworkSelectorExpanded && (
          <div className="mt-2 flex flex-wrap gap-2">
            {networks.map((network) => (
              <button
                key={network}
                onClick={() => toggleNetwork(network)}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                  selectedNetworks.includes(network) ? "bg-primary text-white" : "bg-input text-text hover:bg-hover"
                }`}
                type="button"
              >
                <div className="flex items-center space-x-1">
                  <NetworkIcon iconName={network} className="w-4 h-4" />
                  <span>{network}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <ScrollArea className={twMerge("h-[330px]", isNetworkSelectorExpanded && "h-[259px]")} viewportClassName="h-full">
        <div className="grid grid-cols-1">
          {filteredAssets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => onSelect(asset)}
              className="w-full flex items-center justify-between py-3 hover:px-2 transition-all duration-200"
              type="button"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <TokenIcon iconName={asset.id} className="w-8 h-8" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface flex items-center justify-center">
                    <NetworkIcon iconName={asset.network.id} className="w-3 h-3" />
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted">
                    {asset.symbol}
                    <span className="ml-1 text-xs text-muted">on {asset.network.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="font-medium">{asset.balance}</p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Modal>
  );
};

export default AssetSelection;
