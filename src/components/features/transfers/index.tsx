import { ArchiveIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "../../../store/useAppStore";
import type { Network } from "../../../store/useAppStore";
import { getSupportedNetworks, getSupportedNetworksAll } from "../../../utils/networkUtils";
import Bridge from "../bridge";
import Swap from "../swap";
import AssetSelection, { type Asset } from "./asset-selection";
import NetworkSelection from "./network-selection";

type TabType = "transfer" | "bridge";

const Transfers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("transfer");
  const { setCurrentPage } = useAppStore();
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"from" | "to">("from");
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectingNetwork, setSelectingNetwork] = useState<"from" | "to">("from");

  const {
    fromNetwork,
    toNetwork,
    bridgeFromNetwork,
    bridgeToNetwork,
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    setBridgeFromToken,
    setBridgeFromNetwork,
    setBridgeToNetwork,
  } = useAppStore();

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const handleSelectAsset = (asset: Asset) => {
    const setToken =
      activeTab === "transfer"
        ? selectingFor === "from"
          ? setFromToken
          : setToToken
        : selectingFor === "from"
          ? setBridgeFromToken
          : setBridgeFromToken;

    setToken(asset);
    setShowAssetModal(false);
  };

  const handleSelectNetwork = (network: Network) => {
    if (activeTab === "transfer") {
      if (selectingNetwork === "from") {
        setFromToken({
          ...fromToken,
          network,
        });
      } else {
        setToToken({
          ...toToken,
          network,
        });
      }
    } else {
      if (selectingNetwork === "from") {
        setBridgeFromNetwork(network);
      } else {
        setBridgeToNetwork(network);
      }
    }
    setShowNetworkModal(false);
  };

  const supportedNetworks = useMemo(() => {
    if (activeTab === "transfer") {
      return getSupportedNetworksAll();
    }

    return getSupportedNetworks();
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setCurrentPage("dashboard")} className="text-2xl font-bold">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex gap-4 relative">
          <span
            className={`absolute inset-0 bg-background rounded-lg transition-transform duration-300 ease-in-out ${
              activeTab === "transfer" ? "transform translate-x-0" : "transform translate-x-full"
            }`}
            style={{ width: "50%", left: activeTab === "transfer" ? "-1%" : "3%" }}
          />
          <button
            type="button"
            onClick={() => handleTabChange("transfer")}
            className={`px-4 py-2 font-medium rounded-lg relative z-10 hover:text-text active:text-text transition-colors duration-300 flex-1 ${activeTab === "transfer" ? "text-text" : "text-primary"}`}
          >
            Transfer
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("bridge")}
            className={`px-4 py-2 rounded-lg font-medium relative z-10 hover:text-text active:text-text transition-colors duration-300 flex-1 ${activeTab === "bridge" ? "text-text" : "text-primary"}`}
          >
            Bridge
          </button>
        </div>
        <div className="flex space-x-2">
          <button type="button" className="p-2 rounded-full hover:bg-input">
            <ArchiveIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative flex-grow overflow-hidden h-full">
        <div
          className={twMerge(
            "transition-all duration-300 ease-in-out h-full pb-4 absolute inset-0",
            activeTab === "transfer" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none",
          )}
        >
          <Swap
            setShowAssetModal={setShowAssetModal}
            setSelectingFor={setSelectingFor}
            setShowNetworkModal={setShowNetworkModal}
            setSelectingNetwork={setSelectingNetwork}
          />
        </div>

        <div
          className={twMerge(
            "transition-all duration-300 ease-in-out h-full pb-4 absolute inset-0",
            activeTab === "bridge" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none",
          )}
        >
          <Bridge
            setShowAssetModal={setShowAssetModal}
            setSelectingFor={setSelectingFor}
            setShowNetworkModal={setShowNetworkModal}
            setSelectingNetwork={setSelectingNetwork}
          />
        </div>
      </div>

      <AssetSelection
        isVisible={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        onSelect={handleSelectAsset}
        selectingFor={selectingFor}
        supportedNetworks={supportedNetworks as unknown as Network[]}
        isEvm={activeTab === "bridge"}
      />

      <NetworkSelection
        isVisible={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onSelect={handleSelectNetwork}
        excludeNetwork={
          selectingNetwork === "from"
            ? activeTab === "transfer"
              ? fromNetwork
              : bridgeFromNetwork
            : activeTab === "transfer"
              ? toNetwork
              : bridgeToNetwork
        }
        supportedNetworks={supportedNetworks as unknown as Network[]}
        selectingFor={selectingNetwork}
      />
    </div>
  );
};

export default Transfers;
