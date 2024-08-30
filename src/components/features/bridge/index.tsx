import { ArrowTopRightIcon, CheckIcon } from "@radix-ui/react-icons";
import BigNumber from "bignumber.js";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useConnect } from "wagmi";
import { useHopQuote } from "../../../hooks/useHopQuote";
import { useWalletConnections } from "../../../hooks/useWalletConnections";
import { type Network, useAppStore } from "../../../store/useAppStore";
import { useTheme } from "../../../themes/context";
import NetworkIcon from "../../icons/network";
import TokenIcon from "../../icons/token";
import AssetSelection, { type Asset } from "../swap/asset-selection";
import NetworkSelection from "./network-selection";

const Bridge = () => {
  const { mode } = useTheme();
  const {
    bridgeFromNetwork,
    bridgeToNetwork,
    bridgeFromToken,
    bridgeAmount,
    bridgeSlippage,
    setBridgeFromNetwork,
    setBridgeToNetwork,
    setBridgeFromToken,
    setBridgeAmount,
  } = useAppStore();

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectingNetwork, setSelectingNetwork] = useState<"from" | "to">("from");

  const { isEVMConnected, connectEVM } = useWalletConnections();
  const { connectors } = useConnect();

  const supportedNetworks = ["ethereum", "arbitrum", "polygon", "optimism"];

  const isNetworkPairSupported =
    supportedNetworks.includes(bridgeFromNetwork?.id ?? "") && supportedNetworks.includes(bridgeToNetwork?.id ?? "");

  const { data: quoteData, isLoading: isQuoteLoading } = useHopQuote(
    bridgeAmount,
    bridgeFromToken?.symbol ?? "",
    bridgeFromNetwork?.id ?? "",
    bridgeToNetwork?.id ?? "",
    bridgeSlippage,
    bridgeFromToken?.decimals ?? 18,
  );

  const formatAmount = (value: string, decimals: number) => {
    const bn = new BigNumber(value);
    if (bn.isNaN()) return "0";
    return bn.div(new BigNumber(10).pow(decimals)).toFixed(6);
  };

  const handleSelectAsset = (asset: Asset) => {
    setBridgeFromToken(asset);
    setBridgeFromNetwork(asset.network);
    setShowAssetModal(false);
  };

  const handleSelectNetwork = (network: Network) => {
    if (selectingNetwork === "from") {
      setBridgeFromNetwork(network);
    } else {
      setBridgeToNetwork(network);
    }
    setShowNetworkModal(false);
  };

  const handleNetworkConnect = useCallback(
    (_network: string) => {
      const connector = connectors[0];
      if (connector) {
        connectEVM(connector);
      } else {
        alert("No EVM compatible wallets installed");
      }
    },
    [connectEVM, connectors],
  );

  const isPairSelected = bridgeFromToken && bridgeFromNetwork && bridgeToNetwork;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col space-y-2">
        <div className={twMerge("bg-input rounded-lg p-4", mode === "dark" && "bg-background/50")}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">From</span>
            <span className="text-sm text-muted font-medium flex gap-1.5 items-center min-h-6">
              {bridgeFromNetwork ? (
                isEVMConnected ? (
                  <span className="bg-surface rounded-full p-0.5 px-2 flex items-center gap-1">
                    <NetworkIcon iconName={bridgeFromNetwork.id} className="w-4 h-4" />
                    <p>{bridgeFromNetwork.name}</p>
                    <CheckIcon className="w-4 h-4 text-primary" />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNetworkConnect(bridgeFromNetwork.name)}
                    className="hover:text-text active:text-text transition-colors duration-200 text-primary underline decoration-1 decoration-wavy underline-offset-4"
                  >
                    Connect {bridgeFromNetwork.name}
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectingNetwork("from");
                    setShowNetworkModal(true);
                  }}
                  className="text-primary hover:text-text active:text-text transition-colors duration-200 underline decoration-1 decoration-wavy underline-offset-4"
                >
                  Select network
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
              value={bridgeAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setBridgeAmount(value);
                }
              }}
            />
            <button
              className={twMerge(
                "flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover active:bg-hover transition-colors duration-300",
                mode === "dark" && "bg-surface/80 hover:bg-surface active:bg-surface",
              )}
              type="button"
              onClick={() => setShowAssetModal(true)}
            >
              {bridgeFromToken ? (
                <>
                  <TokenIcon iconName={bridgeFromToken.id} className="w-6 h-6" />
                  <span>{bridgeFromToken.symbol}</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 bg-gray-300 rounded-full" />
                  <span>Select token</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className={twMerge("bg-input rounded-lg p-4", mode === "dark" && "bg-background/30")}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium flex gap-1 items-center">To</span>
            <span className="text-sm text-muted font-medium flex gap-1.5 items-center min-h-6">
              {bridgeToNetwork ? (
                isEVMConnected ? (
                  <span className="bg-surface rounded-full p-0.5 px-2 flex items-center gap-1">
                    <NetworkIcon iconName={bridgeToNetwork.id} className="w-4 h-4" />
                    <p>{bridgeToNetwork.name}</p>
                    <CheckIcon className="w-4 h-4 text-primary" />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNetworkConnect(bridgeToNetwork.name)}
                    className="hover:text-text active:text-text transition-colors duration-200 text-primary underline decoration-1 decoration-wavy underline-offset-4"
                  >
                    Connect {bridgeToNetwork.name}
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectingNetwork("to");
                    setShowNetworkModal(true);
                  }}
                  className="text-primary hover:text-text active:text-text transition-colors duration-200 underline decoration-1 decoration-wavy underline-offset-4"
                >
                  Select network
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
              value={quoteData ? formatAmount(quoteData.estimatedRecieved, bridgeFromToken?.decimals ?? 18) : ""}
              readOnly
            />
            {bridgeFromToken && (
              <div className={twMerge("bg-surface rounded-lg p-2", mode === "dark" && "bg-surface/80")}>
                <span className="bg-surface rounded-full flex items-center gap-2">
                  <TokenIcon iconName={bridgeFromToken.id} />
                  <p>{bridgeFromToken.symbol}</p>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6">
          {isPairSelected && isNetworkPairSupported && quoteData ? (
            <>
              <div className="flex justify-between">
                <p className="text-sm font-medium">Network route</p>
                <p className="text-sm font-medium text-muted">
                  {bridgeFromNetwork?.name} → {bridgeToNetwork?.name}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium">Estimated received</p>
                <p className="text-sm font-medium text-muted">
                  {formatAmount(quoteData.estimatedRecieved, bridgeFromToken?.decimals ?? 18)} {bridgeFromToken?.symbol}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium">Minimum received</p>
                <p className="text-sm font-medium text-muted">
                  {formatAmount(quoteData.amountOutMin, bridgeFromToken?.decimals ?? 18)} {bridgeFromToken?.symbol}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium">Bonder fee</p>
                <p className="text-sm font-medium text-muted">
                  {formatAmount(quoteData.bonderFee, bridgeFromToken?.decimals ?? 18)} {bridgeFromToken?.symbol}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium">Slippage</p>
                <p className="text-sm font-medium text-muted">{quoteData.slippage}%</p>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        className="w-full btn-primary bg-background text-md py-5 px-8 border-none hover-input flex gap-4 items-center rounded-xl text-primary mb-4 sm:mb-0 mt-auto"
        disabled={
          !isPairSelected || !isNetworkPairSupported || !bridgeAmount || isQuoteLoading || !quoteData || !isEVMConnected
        }
        onClick={() => {
          console.log("Submitting bridge with quote:", quoteData);
        }}
      >
        <p className="font-medium transition-all duration-300 flex gap-2 items-center">
          {!isEVMConnected
            ? "Connect wallet"
            : !isPairSelected
              ? "Select token and networks"
              : isQuoteLoading
                ? "Fetching quote..."
                : "Create bridge"}
        </p>
        <ArrowTopRightIcon className="w-5 h-5 ml-auto" />
      </button>
      <AssetSelection
        isVisible={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        onSelect={handleSelectAsset}
        selectingFor="from"
        supportedNetworks={supportedNetworks}
      />
      <NetworkSelection
        isVisible={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onSelect={handleSelectNetwork}
        excludeNetwork={selectingNetwork === "from" ? bridgeToNetwork ?? undefined : bridgeFromNetwork ?? undefined}
        supportedNetworks={supportedNetworks.map((id) => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1) }))}
        selectingFor={selectingNetwork}
      />
    </div>
  );
};

export default Bridge;
