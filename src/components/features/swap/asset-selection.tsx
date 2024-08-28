import { CaretDownIcon, CaretUpIcon, MagnifyingGlassIcon, ResetIcon } from "@radix-ui/react-icons";
import type React from "react";
import { useState, useMemo } from "react";
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
  balance?: string;
}

const networks = ["ethereum", "arbitrum", "polygon", "solana", "bsc"];

interface AssetSelectionProps {
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  isVisible: boolean;
  excludeAsset?: Asset;
  selectingFor: "from" | "to";
}

const AssetSelection: React.FC<AssetSelectionProps> = ({ onClose, onSelect, isVisible, excludeAsset }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [isNetworkSelectorExpanded, setIsNetworkSelectorExpanded] = useState(false);

  const filteredAssets = useMemo(() => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    return mockAssets.filter(
      (asset) =>
        (selectedNetworks.length === 0 || selectedNetworks.includes(asset.network.id)) &&
        (asset.name.toLowerCase().includes(trimmedSearchTerm) ||
          asset.symbol.toLowerCase().includes(trimmedSearchTerm) ||
          asset.network.name.toLowerCase().includes(trimmedSearchTerm)),
    );
  }, [searchTerm, selectedNetworks]);

  const sortedAssets = useMemo(() => {
    return filteredAssets.sort((a, b) => {
      const isAExcluded = excludeAsset && a.id === excludeAsset.id && a.network.id === excludeAsset.network.id;
      const isBExcluded = excludeAsset && b.id === excludeAsset.id && b.network.id === excludeAsset.network.id;
      if (isAExcluded && !isBExcluded) return -1;
      if (!isAExcluded && isBExcluded) return 1;
      return 0;
    });
  }, [filteredAssets, excludeAsset]);

  const toggleNetwork = (network: string) => {
    setSelectedNetworks((prev) => (prev.includes(network) ? prev.filter((n) => n !== network) : [...prev, network]));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} title="Select Asset">
      <div className="relative mb-4 w-full">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full py-2 pl-10 pr-4 bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
      </div>

      <div className="mb-2">
        <div className="flex justify-between">
          <button
            onClick={() => setIsNetworkSelectorExpanded(!isNetworkSelectorExpanded)}
            className="flex items-center space-x-1 text-sm text-muted hover:text-text transition-colors duration-200"
            type="button"
          >
            <span>Filter by network</span>
            {isNetworkSelectorExpanded ? <CaretUpIcon className="w-4 h-4" /> : <CaretDownIcon className="w-4 h-4" />}
          </button>
          {selectedNetworks.length > 0 && (
            <button
              onClick={() => {
                setSelectedNetworks([]);
                setIsNetworkSelectorExpanded(false);
              }}
              className="flex items-center space-x-1 text-sm text-muted hover:text-text transition-colors duration-200"
              type="button"
            >
              <span>Reset filter</span>
              <ResetIcon className="w-4 h-4" />
            </button>
          )}
        </div>
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
          {sortedAssets.map((asset) => {
            const isExcluded =
              excludeAsset && asset.id === excludeAsset.id && asset.network.id === excludeAsset.network.id;
            return (
              <button
                key={`${asset.symbol}-${asset.network.id}`}
                onClick={() => !isExcluded && onSelect(asset)}
                className={`w-full flex items-center justify-between py-3 hover:px-2 transition-all duration-200 ${
                  isExcluded ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="button"
                disabled={isExcluded}
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
                  {isExcluded && <span className="text-sm text-muted mt-0.5">Used</span>}

                  <p className="font-medium">{asset.balance}</p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </Modal>
  );
};

export default AssetSelection;
