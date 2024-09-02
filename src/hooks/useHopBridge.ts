import { Hop, type HopBridge, getChain } from "@hop-protocol/sdk";
import { useCallback, useMemo } from "react";
import { parseUnits } from "viem";
import { useChainId, useSwitchChain } from "wagmi";
import { useEthersSigner } from "./useEthersSigner";
import { useWalletConnections } from "./useWalletConnections";
import { useToast } from "../components/ui/toast";
import type { Network, Token } from "../store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

interface ApprovalParams {
  bridge: HopBridge;
  amount: bigint;
  fromNetwork: Network;
}

interface BridgeParams {
  amount: string;
  fromToken: Token;
  fromNetwork: Network;
  toNetwork: Network;
}

interface QuoteParams {
  amount: string;
  token: string;
  fromChain: string;
  toChain: string;
  slippage: number;
  decimals: number;
}

export const useHopBridge = () => {
  const chainId = useChainId();
  const signer = useEthersSigner({ chainId });
  const { switchChainAsync } = useSwitchChain();
  const { isEVMConnected, evmAddress } = useWalletConnections();
  const { addToast } = useToast();

  const hop = useMemo(() => {
    if (signer) {
      return new Hop("mainnet").connect(signer);
    }
    return new Hop("mainnet");
  }, [signer]);

  const handleApproval = useCallback(
    async ({ bridge, amount, fromNetwork }: ApprovalParams) => {
      const approvalAddress = await bridge.getSendApprovalAddress(
        getChain(fromNetwork.chainId.toString()),
      );
      const token = bridge.getCanonicalToken(
        getChain(fromNetwork.chainId.toString()),
      );
      const allowance = await token.allowance(approvalAddress);
      const transferAmount = amount.toString();

      if (allowance.lt(transferAmount)) {
        const tx = await token.approve(approvalAddress, transferAmount);
        console.log(tx.hash);
        await tx.wait();
      }
    },
    [],
  );

  const executeBridge = useCallback(
    async ({ amount, fromToken, fromNetwork, toNetwork }: BridgeParams) => {
      if (
        !isEVMConnected ||
        !signer ||
        !fromToken ||
        !fromNetwork ||
        !toNetwork
      ) {
        console.error("Missing required data for bridging");
        addToast("Missing required data for bridging", "error");
        return;
      }

      try {
        if (chainId !== fromNetwork.chainId) {
          await switchChainAsync({ chainId: fromNetwork.chainId });
        }

        if (!hop.signer) {
          hop.connect(signer);
        }

        const amountBN = parseUnits(amount, fromToken.decimals ?? 18);
        const bridge = hop.bridge(fromToken.symbol);

        if (
          fromToken.id.toLowerCase() !==
          fromNetwork.nativeTokenSymbol.toLowerCase()
        ) {
          await handleApproval({ bridge, amount: amountBN, fromNetwork });
          console.log("Approval transaction submitted");
        }

        const tx = await bridge.send(
          amountBN.toString(),
          getChain(fromNetwork.chainId.toString()),
          toNetwork.id,
          {
            recipient: evmAddress,
          },
        );

        addToast(`Bridge transaction submitted: ${tx.hash}`, "success");
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "details" in error) {
          addToast(
            `Error during bridge transaction.\nDetails: ${(error as { details: string }).details}`,
            "error",
          );
        } else {
          addToast(
            "An unexpected error occurred during the bridge transaction.",
            "error",
          );
        }
      }
    },
    [
      chainId,
      signer,
      isEVMConnected,
      evmAddress,
      switchChainAsync,
      handleApproval,
      hop,
      addToast,
    ],
  );

  const getQuote = async ({
    amount,
    token,
    fromChain,
    toChain,
    slippage,
    decimals,
  }: QuoteParams) => {
    if (!isEVMConnected) {
      throw new Error("EVM wallet not connected");
    }

    console.log("Quote params:", {
      amount,
      token,
      fromChain,
      toChain,
      slippage,
      decimals,
    });

    try {
      const bridge = hop.bridge(token);
      console.log("Bridge created");

      const amountBN = parseUnits(amount, decimals);
      console.log("Amount parsed:", amountBN.toString());

      console.log(
        "Calling getSendData with:",
        amountBN.toString(),
        getChain(fromChain),
        getChain(toChain),
      );
      const quote = await bridge.getSendData(
        amountBN.toString(),
        getChain(fromChain),
        getChain(toChain),
      );
      console.log("Quote received:", quote);

      return {
        amountIn: BigNumber(quote.amountIn._hex).toString(),
        amountOut: BigNumber(quote.amountOut._hex).toString(),
        rate: quote.rate,
        priceImpact: quote.priceImpact,
        destinationTxFee: quote.destinationTxFee,
        adjustedDestinationTxFee: quote.adjustedDestinationTxFee,
        totalFee: quote.totalFee,
        estimatedReceived: BigNumber(quote.estimatedReceived._hex).toString(),
        tokenPriceRate: quote.tokenPriceRate,
        chainNativeTokenPrice: quote.chainNativeTokenPrice,
        tokenPrice: quote.tokenPrice,
        slippage: slippage,
      };
    } catch (error) {
      console.error("Error in getQuote:", error);
      throw error;
    }
  };

  const useHopQuote = (params: QuoteParams) => {
    return useQuery({
      queryKey: ["hopQuote", params],
      queryFn: () => getQuote(params),
      enabled:
        isEVMConnected &&
        !!params.amount &&
        !!params.token &&
        !!params.fromChain &&
        !!params.toChain &&
        !!params.decimals,
    });
  };

  return { executeBridge, useHopQuote };
};
