import type { Hop } from "@hop-protocol/sdk";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { parseUnits } from "viem";
import { useWalletConnections } from "./useWalletConnections";

const getChain = (chain: string) => {
  if (chain === "mainnet") {
    return "ethereum";
  }

  return chain;
};

export const useHopQuote = (
  amount: string,
  token: string,
  fromChain: string,
  toChain: string,
  slippage: number,
  decimals: number,
  hop: Hop,
) => {
  const { isEVMConnected } = useWalletConnections();

  return useQuery({
    queryKey: ["hopQuote", amount, token, fromChain, toChain, slippage, decimals],
    queryFn: async () => {
      if (!isEVMConnected) {
        throw new Error("EVM wallet not connected");
      }

      const bridge = hop.bridge(token);
      const amountBN = parseUnits(amount, decimals);
      const quote = await bridge.getSendData(amountBN.toString(), getChain(fromChain), getChain(toChain));

      const quoteReturn = {
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

      return quoteReturn;
    },
    enabled: isEVMConnected && !!amount && !!token && !!fromChain && !!toChain && !!decimals,
  });
};
