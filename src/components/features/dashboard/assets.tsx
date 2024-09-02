import { getChainId } from "@wagmi/core";
import React from "react";
import { useCallback, useMemo } from "react";
import { type TokenBalance, useEVMTokenBalances, useSolanaTokenBalances } from "../../../hooks/useTokenBalances";
import { config } from "../../../wagmi";
import NetworkIcon from "../../icons/network";
import TokenIcon from "../../icons/token";

const AssetItem = React.memo(
  ({
    token,
    getNetworkFromToken,
  }: {
    token: TokenBalance;
    getNetworkFromToken: (token: string) => string;
  }) => {
    const formattedBalance = useMemo(() => {
      return token.decimals ? (Number(token.balance) / 10 ** token.decimals).toFixed(4) : token.balance;
    }, [token.balance, token.decimals]);

    return (
      <div className="flex items-center justify-between rounded-lg transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {token.logo ? (
              <img src={token.logo} alt={token.name || token.symbol} className="w-8 h-8 rounded-full" />
            ) : (
              <TokenIcon iconName={token.symbol?.toLowerCase() || token.token} className="w-8 h-8" />
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface flex items-center justify-center">
              <NetworkIcon iconName={getNetworkFromToken(token.token)} className="w-3 h-3" />
            </div>
          </div>
          <div className="text-start">
            <p className="font-medium">{token.name || token.symbol || token.token}</p>
            <p className="text-sm text-muted">{token.symbol || token.token}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">{formattedBalance}</p>
        </div>
      </div>
    );
  },
);

AssetItem.displayName = "AssetItem";

export const Assets = () => {
  const chainId = getChainId(config);
  const { data: evmTokens, isLoading: isLoadingEVM } = useEVMTokenBalances(chainId);
  const { data: solanaTokens, isLoading: isLoadingSolana } = useSolanaTokenBalances();

  const allTokens = useMemo(() => {
    const tokens = [...(evmTokens ?? []), ...(solanaTokens ?? [])];
    return tokens.sort((a, b) => {
      if (BigInt(a.balance) > BigInt(0) && BigInt(b.balance) === BigInt(0)) return -1;
      if (BigInt(a.balance) === BigInt(0) && BigInt(b.balance) > BigInt(0)) return 1;
      return 0;
    });
  }, [evmTokens, solanaTokens]);

  const getNetworkFromToken = useCallback((token: string): string => {
    if (token.startsWith("0x")) return "ethereum";
    if (token === "11111111111111111111111111111111") return "solana";
    return "unknown";
  }, []);

  if (isLoadingEVM || isLoadingSolana) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-3">
      {allTokens.map((token, index) => (
        <AssetItem key={`${token.token}-${index}`} token={token} getNetworkFromToken={getNetworkFromToken} />
      ))}
    </div>
  );
};
