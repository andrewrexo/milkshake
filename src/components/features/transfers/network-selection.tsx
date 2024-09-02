import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type React from "react";
import { useState } from "react";
import type { Network } from "../../../store/useAppStore";
import NetworkIcon from "../../icons/network";
import Modal from "../../ui/modal";
import ScrollArea from "../../ui/scroll-area";

interface NetworkSelectionProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (network: Network) => void;
  excludeNetwork?: Network | null;
  supportedNetworks: Network[];
  selectingFor: "from" | "to";
}

const NetworkSelection: React.FC<NetworkSelectionProps> = ({
  isVisible,
  onClose,
  onSelect,
  excludeNetwork,
  supportedNetworks,
  selectingFor,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNetworks = supportedNetworks.filter(
    (network) =>
      network.id !== excludeNetwork?.id &&
      (network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        network.id.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title={`Select ${selectingFor === "from" ? "Source" : "Destination"} Network`}
    >
      <div className="flex flex-col h-full">
        <div className="relative mb-4 w-full px-2">
          <input
            type="text"
            placeholder="Search networks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
        </div>

        <ScrollArea className="flex-grow px-2" viewportClassName="h-full">
          <div className="grid grid-cols-1 gap-2">
            {filteredNetworks.map((network) => (
              <button
                key={network.id}
                onClick={() => onSelect(network)}
                className="w-full flex items-center justify-between py-3 px-2 hover:bg-hover transition-colors duration-200 rounded-lg"
                type="button"
              >
                <div className="flex items-center space-x-3">
                  <NetworkIcon iconName={network.id} className="w-8 h-8" />
                  <div className="text-left">
                    <p className="font-medium">{network.name}</p>
                    <p className="text-sm text-muted">{network.id}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Modal>
  );
};

export default NetworkSelection;
