import { ArchiveIcon, CheckCircledIcon, CheckIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useConnect } from "wagmi";
import { useWalletConnections } from "../../../hooks/useWalletConnections";
import { useAppStore } from "../../../store/useAppStore";
import { useTheme } from "../../../themes/context";
import TokenIcon from "../../icons/token";
import AssetSelection, { type Asset } from "./asset-selection";

const Swap = () => {
  const { mode } = useTheme();
  const [selectingFor, setSelectingFor] = useState<"from" | "to">("from");
  const { setCurrentPage } = useAppStore();
  const { isEVMConnected, isSolanaConnected, connectEVM, connectSolana } = useWalletConnections();
  const { connectors } = useConnect();

  const { toToken, fromToken, setToToken, setFromToken, toNetwork, fromNetwork, setShowModal, showModal } = useAppStore(
    (state) => ({
      toToken: state.toToken,
      fromToken: state.fromToken,
      setToToken: state.setToToken,
      setFromToken: state.setFromToken,
      toNetwork: state.toNetwork,
      fromNetwork: state.fromNetwork,
      setShowModal: state.setShowModal,
      showModal: state.showModal,
    }),
  );

  const handleSelectAsset = (asset: Asset) => {
    if (selectingFor === "from") {
      setFromToken({
        ...asset,
      });
    } else {
      setToToken({
        ...asset,
      });
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
          // todo: handle this better
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
    <div className="flex flex-col h-full pb-4 relative">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setCurrentPage("connect")} className="text-2xl font-bold">
          ←
        </button>
        <h2 className="text-xl font-bold">Transfer</h2>
        <div className="flex space-x-2">
          <button type="button" className="p-2 rounded-full hover:bg-input">
            <ArchiveIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 mb-4">
        <div className={twMerge("bg-input rounded-lg p-4", mode === "dark" && "bg-background")}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">From</span>
            <span className="text-sm text-muted font-medium flex gap-1.5 items-center">
              {isNetworkConnected(fromNetwork?.name) ? (
                <>
                  <p>{fromNetwork?.name}</p>
                  <span className="bg-primary rounded-full p-0.5 mb-0.5">
                    <div className="group relative">
                      <CheckIcon className="w-3 h-3 text-white" />
                      <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-background text-text text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Connected
                      </span>
                    </div>
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNetworkConnect(fromNetwork?.name)}
                  className="text-primary underline decoration-1 decoration-wavy underline-offset-4"
                >
                  {fromNetwork?.name}
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input type="text" placeholder="0" className="text-2xl font-bold bg-transparent outline-none w-1/2" />
            <button
              className={twMerge(
                "flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover",
                mode === "dark" && "bg-surface/80 hover:bg-surface",
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
            className="p-2 rounded-full bg-surface hover:bg-hover hover:scale-105 transition-transform duration-300 active:scale-90"
            type="button"
            onClick={handleReverseTokens}
          >
            <DoubleArrowDownIcon className="w-5 h-5" />
          </button>
        </div>

        <div className={twMerge("bg-input rounded-lg p-4", mode === "dark" && "bg-background")}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">To</span>
            <span className="text-sm text-muted font-medium flex gap-1.5">
              {isNetworkConnected(toNetwork?.name) ? (
                <>
                  <p>{toNetwork?.name}</p>

                  <span className="flex items-center">
                    <div className="group relative bg-primary rounded-full p-0.5 mb-0.5">
                      <CheckIcon className="w-3 h-3 text-white" />
                      <span className="absolute left-1/2 -translate-x-1/2 -top-8 bg-background text-text text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Connected
                      </span>
                    </div>
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNetworkConnect(toNetwork?.name)}
                  className="text-primary underline decoration-1 decoration-wavy underline-offset-4"
                >
                  {toNetwork?.name}
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
              readOnly
            />
            <button
              className={twMerge(
                "flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover",
                mode === "dark" && "bg-surface/80 hover:bg-surface",
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
        <div className="flex flex-col gap-2 pt-2">
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
      <button type="button" className="btn-primary bg-background text-center py-3">
        Create transfer
      </button>
      <AssetSelection isVisible={showModal} onClose={handleCloseModal} onSelect={handleSelectAsset} />
    </div>
  );
};

export default Swap;
