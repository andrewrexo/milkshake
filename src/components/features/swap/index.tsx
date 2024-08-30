import { ArrowTopRightIcon, CheckIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useConnect } from "wagmi";
import { useWalletConnections } from "../../../hooks/useWalletConnections";
import { useTheme } from "../../../themes/context";
import NetworkIcon from "../../icons/network";
import TokenIcon from "../../icons/token";
import Bridge from "../bridge";
import AssetSelection, { type Asset } from "./asset-selection";
import { useAppStore } from "../../../store/useAppStore";

type TabType = "transfer" | "bridge";

const Swap = () => {
  const { mode } = useTheme();
  const [selectingFor, setSelectingFor] = useState<"from" | "to">("from");
  const { isEVMConnected, isSolanaConnected, connectEVM, connectSolana } = useWalletConnections();
  const { connectors } = useConnect();

  const {
    toToken,
    fromToken,
    setToToken,
    setFromToken,
    toNetwork,
    fromNetwork,
    setShowModal,
    showModal,
    setFromNetwork,
    setToNetwork,
  } = useAppStore((state) => ({
    toToken: state.toToken,
    fromToken: state.fromToken,
    setToToken: state.setToToken,
    setFromToken: state.setFromToken,
    toNetwork: state.toNetwork,
    fromNetwork: state.fromNetwork,
    setShowModal: state.setShowModal,
    showModal: state.showModal,
    setFromNetwork: state.setFromNetwork,
    setToNetwork: state.setToNetwork,
  }));

  const [amount, setAmount] = useState("");

  const handleSelectAsset = (asset: Asset) => {
    if (selectingFor === "from") {
      setFromToken(asset);
      setFromNetwork(asset.network); // Set the network based on the selected asset
    } else {
      setToToken(asset);
      setToNetwork(asset.network); // Set the network based on the selected asset
    }
    setShowModal(false);
  };

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const handleReverseTokens = useCallback(() => {
    if (fromToken && toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
    }
  }, [fromToken, toToken, setFromToken, setToToken]);

  const handleNetworkConnect = useCallback(
    (network: string) => {
      if (network === "Solana") {
        connectSolana();
      } else {
        const connector = connectors[0];
        if (connector) {
          connectEVM(connector);
        } else {
          alert("No EVM compatible wallets installed");
        }
      }
    },
    [connectSolana, connectEVM, connectors],
  );

  const isNetworkConnected = useCallback(
    (network: string) => {
      if (network === "Solana") {
        return isSolanaConnected;
      }
      return isEVMConnected;
    },
    [isSolanaConnected, isEVMConnected],
  );

  return (
    <div className="flex flex-col h-full ">
      <div className="flex flex-col space-y-2 mb-4 h-full">
        <div className={twMerge("bg-input rounded-lg p-4", mode === "dark" && "bg-background/50")}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">From</span>
            <span className="text-sm text-muted font-medium flex gap-1.5 items-center min-h-6">
              {isNetworkConnected(fromNetwork?.name) ? (
                <span className="bg-surface rounded-full p-0.5 px-2 flex items-center gap-1">
                  <NetworkIcon iconName={fromNetwork?.id} className="w-4 h-4" />
                  <p>{fromNetwork?.name}</p>
                  <CheckIcon className="w-4 h-4 text-primary" />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNetworkConnect(fromNetwork?.name)}
                  className="hover:text-hover active:text-hover transition-colors duration-200 text-primary underline decoration-1 decoration-wavy underline-offset-4"
                >
                  Connect {fromNetwork?.name}
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setAmount(value);
                }
              }}
            />
            <button
              className={twMerge(
                "flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover active:bg-hover transition-colors duration-300",
                mode === "dark" && "bg-surface/80 hover:bg-surface active:bg-surface",
              )}
              type="button"
              onClick={() => {
                setSelectingFor("from");
                setShowModal(true);
              }}
            >
              {fromToken ? (
                <>
                  <TokenIcon iconName={fromToken.id} className="w-6 h-6" />
                  <span>{fromToken.symbol}</span>
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

        <div className="flex justify-center">
          <button
            className="p-2 rounded-full bg-surface hover:bg-hover hover:scale-105 transition-all duration-300 active:scale-90 active:bg-hover"
            type="button"
            onClick={handleReverseTokens}
          >
            <DoubleArrowDownIcon className="w-5 h-5" />
          </button>
        </div>

        <div className={twMerge("bg-input rounded-lg p-4", mode === "dark" && "bg-background/30")}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium flex gap-1 items-center">To</span>
            <span className="text-sm text-muted font-medium flex gap-1.5 items-center min-h-6">
              {isNetworkConnected(toNetwork?.name) ? (
                <span className="bg-surface rounded-full p-0.5 px-2 flex items-center gap-1">
                  <NetworkIcon iconName={toNetwork?.id} className="w-4 h-4" />
                  <p>{toNetwork?.name}</p>
                  <CheckIcon className="w-4 h-4 text-primary" />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNetworkConnect(toNetwork?.name)}
                  className="hover:text-hover active:text-hover transition-colors duration-200 text-primary underline decoration-1 decoration-wavy underline-offset-4"
                >
                  Connect {toNetwork?.name}
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
              value={""}
              readOnly
            />
            <button
              className={twMerge(
                "flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover active:bg-hover transition-colors duration-300",
                mode === "dark" && "bg-surface/80 hover:bg-surface active:bg-surface",
              )}
              type="button"
              onClick={() => {
                setSelectingFor("to");
                setShowModal(true);
              }}
            >
              {toToken ? (
                <>
                  <TokenIcon iconName={toToken.id} className="w-6 h-6" />
                  <span>{toToken.symbol}</span>
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
        <div className="flex flex-col gap-2 pt-6">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Network route</p>
            <p className="text-sm font-medium text-muted">
              {fromNetwork?.name} → {toNetwork?.name}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-medium">Arrival estimate</p>
            <p className="text-sm font-medium text-muted">Instantly</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="w-full btn-primary bg-background text-md py-5 px-8 border-none hover-input flex gap-4 items-center rounded-xl text-primary "
        disabled={!amount || !fromToken || !toToken}
        onClick={() => {
          console.log("Submitting transfer:", { amount, fromToken, toToken });
        }}
      >
        <p className="font-medium transition-all duration-300 flex gap-2 items-center">Create transfer</p>
        <ArrowTopRightIcon className="w-5 h-5 ml-auto" />
      </button>
      <AssetSelection
        isVisible={showModal}
        onClose={handleCloseModal}
        onSelect={handleSelectAsset}
        selectingFor={selectingFor}
        excludeAsset={selectingFor === "from" ? toToken : fromToken}
      />
    </div>
  );
};

export default Swap;
