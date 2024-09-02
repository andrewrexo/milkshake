import { ArrowTopRightIcon, CheckIcon } from "@radix-ui/react-icons";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useConnect, useSwitchChain, useChainId } from "wagmi";
import { useHopQuote } from "../../../hooks/useHopQuote";
import { useWalletConnections } from "../../../hooks/useWalletConnections";
import { type Network, useAppStore } from "../../../store/useAppStore";
import { useTheme } from "../../../themes/context";
import NetworkIcon from "../../icons/network";
import TokenIcon from "../../icons/token";
import AssetSelection, { type Asset } from "../swap/asset-selection";
import NetworkSelection from "./network-selection";
import { debounce } from "lodash";
import { getChain, Hop, type HopBridge } from "@hop-protocol/sdk";
import { useEthersSigner } from "../../../hooks/useEthersSigner";
import { parseUnits } from "viem";
import { getSupportedNetworks } from "../../../utils/networkUtils";

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

  const chainId = useChainId();
  const signer = useEthersSigner({ chainId });

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectingNetwork, setSelectingNetwork] = useState<"from" | "to">("from");

  const { switchChainAsync } = useSwitchChain();
  const { isEVMConnected, connectEVM, evmAddress } = useWalletConnections();
  const { connectors } = useConnect();

  const hop = useMemo(() => new Hop("mainnet"), []);

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

  const [debouncedQuoteParams, setDebouncedQuoteParams] = useState({
    amount: bridgeAmount,
    symbol: bridgeFromToken?.symbol ?? "",
    fromNetwork: bridgeFromNetwork?.id ?? "",
    toNetwork: bridgeToNetwork?.id ?? "",
    slippage: bridgeSlippage,
    decimals: bridgeFromToken?.decimals ?? 18,
  });

  useEffect(() => {
    debouncedParams({
      amount: bridgeAmount,
      symbol: bridgeFromToken?.symbol ?? "",
      fromNetwork: bridgeFromNetwork?.id ?? "",
      toNetwork: bridgeToNetwork?.id ?? "",
      slippage: bridgeSlippage,
      decimals: bridgeFromToken?.decimals ?? 18,
    });

    return () => {
      debouncedParams.cancel();
    };
  }, [bridgeAmount, bridgeFromToken, bridgeFromNetwork, bridgeToNetwork, bridgeSlippage, debouncedParams]);

  const { data: quoteData, isLoading: isQuoteLoading } = useHopQuote(
    debouncedQuoteParams.amount,
    debouncedQuoteParams.symbol,
    debouncedQuoteParams.fromNetwork,
    debouncedQuoteParams.toNetwork,
    debouncedQuoteParams.slippage,
    debouncedQuoteParams.decimals,
    hop,
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

  const handleApproval = async (bridge: HopBridge, amount: bigint) => {
    if (!bridgeFromNetwork) {
      return false;
    }

    const approvalAddress = await bridge.getSendApprovalAddress(bridgeFromNetwork.id);
    const token = bridge.getCanonicalToken(bridgeFromNetwork.id);
    const allowance = await token.allowance(approvalAddress);
    const transferAmount = amount.toString();

    if (allowance.lt(transferAmount)) {
      const tx = await token.approve(approvalAddress, transferAmount);
      console.log(tx.hash);
      await tx.wait();
    }
  };

  const handleBridge = async () => {
    if (!isEVMConnected || !signer || !quoteData || !bridgeFromToken || !bridgeFromNetwork || !bridgeToNetwork) {
      console.error("Missing required data for bridging");
      return;
    }

    try {
      // Check the network and switch if necessary
      if (chainId !== bridgeFromNetwork.chainId) {
        await switchChainAsync({
          chainId: bridgeFromNetwork.chainId,
        });
      }

      hop.connect(signer);

      const amountBN = parseUnits(bridgeAmount, bridgeFromToken.decimals ?? 18);
      const bridge = hop.bridge(bridgeFromToken.symbol);

      if (bridgeFromToken.id.toLowerCase() !== bridgeFromNetwork.nativeTokenSymbol.toLowerCase()) {
        await handleApproval(bridge, amountBN);
        console.log("Approval transaction submitted");
      }

      const tx = await bridge.send(
        amountBN.toString(),
        getChain(bridgeFromNetwork.chainId.toString()),
        bridgeToNetwork.id,
        {
          recipient: evmAddress,
        },
      );

      console.log("Bridge transaction submitted:", tx.hash);

      // todo: add toast
    } catch (error) {
      console.error("Error during bridging:", error);
      // todo: add toast
    }
  };

  const isPairSelected = bridgeFromToken && bridgeFromNetwork && bridgeToNetwork;
  const supportedNetworks = getSupportedNetworks();

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
                "flex items-center space-x-2 bg-surface rounded-lg p-2 hover-input transition-all duration-300",
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
              type="text"
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
          {isPairSelected && quoteData ? (
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
          className="w-full btn-primary bg-background text-md py-5 px-8 border-none hover-input flex gap-4 items-center rounded-xl text-primary"
          disabled={!isPairSelected || !bridgeAmount || isQuoteLoading || !quoteData || !isEVMConnected}
          onClick={() => handleBridge()}
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
      </div>
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
        supportedNetworks={supportedNetworks}
        selectingFor={selectingNetwork}
      />
    </div>
  );
};

export default Bridge;
