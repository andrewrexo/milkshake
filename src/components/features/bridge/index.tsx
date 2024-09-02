import { useHopBridge } from "../../../hooks/useHopBridge";
import { ArrowTopRightIcon, CheckIcon } from "@radix-ui/react-icons";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useConnect } from "wagmi";
import { useWalletConnections } from "../../../hooks/useWalletConnections";
import { useAppStore } from "../../../store/useAppStore";
import { useTheme } from "../../../themes/context";
import NetworkIcon from "../../icons/network";
import TokenIcon from "../../icons/token";
import { useToast } from "../../ui/toast";
import { formatAmount } from "../../../lib/formatter";

interface BridgeProps {
  setShowAssetModal: (show: boolean) => void;
  setSelectingFor: (selectingFor: "from" | "to") => void;
  setShowNetworkModal: (show: boolean) => void;
  setSelectingNetwork: (selectingFor: "from" | "to") => void;
}

const Bridge: React.FC<BridgeProps> = ({
  setShowAssetModal,
  setSelectingFor,
  setShowNetworkModal,
  setSelectingNetwork,
}) => {
  const { mode } = useTheme();
  const { bridgeFromNetwork, bridgeToNetwork, bridgeFromToken, bridgeAmount, bridgeSlippage, setBridgeAmount } =
    useAppStore();

  const { isEVMConnected, connectEVM } = useWalletConnections();
  const { connectors } = useConnect();
  const { addToast } = useToast();

  const { executeBridge, useHopQuote } = useHopBridge();

  const debouncedParams = useMemo(() => {
    return debounce(
      (params: {
        amount: string;
        symbol: string;
        fromNetwork: string;
        toNetwork: string;
        slippage: number;
        decimals: number;
      }) => {
        setDebouncedQuoteParams(params);
      },
      400,
    );
  }, []);

  const isSamePair = useMemo(
    () => bridgeFromNetwork?.chainId === bridgeToNetwork?.chainId,
    [bridgeFromNetwork, bridgeToNetwork],
  );

  const [debouncedQuoteParams, setDebouncedQuoteParams] = useState({
    amount: bridgeAmount,
    symbol: bridgeFromToken?.symbol ?? "",
    fromNetwork: bridgeFromNetwork?.chainId.toString() ?? "",
    toNetwork: bridgeToNetwork?.chainId.toString() ?? "",
    slippage: bridgeSlippage,
    decimals: bridgeFromToken?.decimals ?? 18,
  });

  const {
    data: quoteData,
    isLoading: isQuoteLoading,
    error: quoteError,
  } = useHopQuote({
    amount: debouncedQuoteParams.amount,
    token: debouncedQuoteParams.symbol,
    fromChain: debouncedQuoteParams.fromNetwork,
    toChain: debouncedQuoteParams.toNetwork,
    slippage: debouncedQuoteParams.slippage,
    decimals: debouncedQuoteParams.decimals,
  });

  useEffect(() => {
    if (isSamePair) {
      return;
    }

    debouncedParams({
      amount: bridgeAmount,
      symbol: bridgeFromToken?.symbol ?? "",
      fromNetwork: bridgeFromNetwork?.chainId.toString() ?? "",
      toNetwork: bridgeToNetwork?.chainId.toString() ?? "",
      slippage: bridgeSlippage,
      decimals: bridgeFromToken?.decimals ?? 18,
    });

    return () => {
      debouncedParams.cancel();
    };
  }, [bridgeAmount, bridgeFromToken, bridgeFromNetwork, bridgeToNetwork, bridgeSlippage, debouncedParams, isSamePair]);

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

  const handleBridge = async () => {
    if (!bridgeFromToken || !bridgeFromNetwork || !bridgeToNetwork) {
      console.error("Missing required data for bridging");
      addToast("Missing required data for bridging", "error");
      return;
    }

    await executeBridge({
      amount: bridgeAmount,
      fromToken: bridgeFromToken,
      fromNetwork: bridgeFromNetwork,
      toNetwork: bridgeToNetwork,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col space-y-2">
        <div className={twMerge("bg-input rounded-lg p-4", mode === "dark" && "bg-background/50")}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">From</span>
            <span className="text-sm text-muted font-medium flex gap-1.5 items-center min-h-6">
              {bridgeFromNetwork ? (
                isEVMConnected ? (
                  <button
                    type="button"
                    className="bg-surface rounded-full p-0.5 px-2 flex items-center gap-1 hover-input"
                    onClick={() => {
                      setSelectingNetwork("from");
                      setShowNetworkModal(true);
                    }}
                  >
                    <NetworkIcon iconName={bridgeFromNetwork.id} className="w-4 h-4" />
                    <p>{bridgeFromNetwork.name}</p>
                    <CheckIcon className="w-4 h-4 text-primary" />
                  </button>
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
              type="number"
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
                "flex items-center space-x-2 bg-surface rounded-lg p-2 hover-input transition-all duration-300",
                mode === "dark" && "bg-surface/80 hover:bg-surface active:bg-surface",
              )}
              type="button"
              onClick={() => {
                setSelectingFor("from");
                setShowAssetModal(true);
              }}
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

        <div className={twMerge("bg-input rounded-lg p-4", mode === "dark" && "bg-background")}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium flex gap-1 items-center">To</span>
            <span className="text-sm text-muted font-medium flex gap-1.5 items-center min-h-6">
              {bridgeToNetwork ? (
                isEVMConnected ? (
                  <button
                    type="button"
                    className="bg-surface rounded-full p-0.5 px-2 flex items-center gap-1 hover-input"
                    onClick={() => {
                      setSelectingNetwork("to");
                      setShowNetworkModal(true);
                    }}
                  >
                    <NetworkIcon iconName={bridgeToNetwork.id} className="w-4 h-4" />
                    <p>{bridgeToNetwork.name}</p>
                    <CheckIcon className="w-4 h-4 text-primary" />
                  </button>
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
              type="number"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
              value={quoteData ? formatAmount(quoteData.estimatedReceived, bridgeFromToken?.decimals ?? 18) : ""}
              readOnly
            />
            {bridgeFromToken && (
              <div className={twMerge("bg-surface rounded-lg p-2 pointer-events-none")}>
                <span className="bg-surface rounded-full flex items-center gap-2">
                  <TokenIcon iconName={bridgeFromToken.id} />
                  <p>{bridgeFromToken.symbol}</p>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6">
          {quoteData && !isSamePair ? (
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
                  {formatAmount(quoteData.amountOut, bridgeFromToken?.decimals ?? 18)} {bridgeFromToken?.symbol}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium">Minimum received</p>
                <p className="text-sm font-medium text-muted">
                  {formatAmount(quoteData.estimatedReceived, bridgeFromToken?.decimals ?? 18)} {bridgeFromToken?.symbol}
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
      <div className="pt-6 px-2 mb-4 sm:mb-0 mt-auto">
        <button
          type="button"
          className={twMerge(
            "w-full btn-primary bg-background text-md py-5 px-8 border-none hover-input flex gap-4 items-center rounded-xl text-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
          )}
          disabled={!bridgeAmount || isQuoteLoading || !quoteData || !isEVMConnected || isSamePair}
          onClick={() => handleBridge()}
        >
          <p className="font-medium transition-all duration-300 flex gap-2 items-center w-full">
            {!isEVMConnected ? (
              "Connect wallet"
            ) : isSamePair ? (
              "Select a network"
            ) : isQuoteLoading ? (
              "Fetching quote..."
            ) : (
              <span className="flex gap-2 items-center flex-1 w-full">
                Create bridge
                <ArrowTopRightIcon className="w-5 h-5 ml-auto" />
              </span>
            )}
          </p>
        </button>
      </div>
    </div>
  );
};

export default Bridge;
