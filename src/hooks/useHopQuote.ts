import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

interface HopQuote {
  amountIn: string;
  slippage: number;
  amountOutMin: string;
  destinationAmountOutMin: string;
  bonderFee: string;
  estimatedRecieved: string;
  deadline: number;
  destinationDeadline: number;
}

const supportedNetworks = ["ethereum", "arbitrum", "polygon", "optimism"];

const fetchHopQuote = async (
  amount: string,
  token: string,
  fromChain: string,
  toChain: string,
  slippage: number,
  decimals: number,
): Promise<HopQuote> => {
  const adjustedAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString(10);
  const response = await fetch(
    `https://api.hop.exchange/v1/quote?amount=${adjustedAmount}&token=${token}&fromChain=${fromChain}&toChain=${toChain}&slippage=${slippage}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch quote");
  }
  return response.json();
};

export const useHopQuote = (
  amount: string,
  token: string,
  fromChain: string,
  toChain: string,
  slippage: number,
  decimals: number,
) => {
  const isSupported = supportedNetworks.includes(fromChain) && supportedNetworks.includes(toChain);

  return useQuery<HopQuote, Error>({
    queryKey: ["hopQuote", amount, token, fromChain, toChain, slippage, decimals],
    queryFn: () => fetchHopQuote(amount, token, fromChain, toChain, slippage, decimals),
    enabled: !!amount && !!token && !!fromChain && !!toChain && isSupported && !!decimals,
  });
};
