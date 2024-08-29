import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getEVMChainReferenceById } from "../lib/supported-networks";

const ALCHEMY_API_KEY = "DtMGQDy-FOT3omEQWpNI9dczEIMlugoA";
const SOLANA_ALCHEMY_ENDPOINT = "https://solana-mainnet.g.alchemy.com/v2/";
const SOLANA_RPC_ENDPOINT = `${SOLANA_ALCHEMY_ENDPOINT}${ALCHEMY_API_KEY}/`;

export interface TokenBalance {
  token: string;
  balance: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logo?: string;
}

interface TokenMetadata {
  decimals: number;
  logo?: string;
  name: string;
  symbol: string;
}

async function fetchEVMTokenBalances(address: string, chainId: number): Promise<TokenBalance[]> {
  const chainReference = getEVMChainReferenceById(chainId);

  if (!chainReference) {
    console.error(`Unsupported chain id: ${chainId}`);
    return [];
  }

  // Fetch ERC20 token balances
  const tokenResponse = await fetch(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTokenBalances",
      params: [address, "erc20"],
    }),
  });
  const tokenData = await tokenResponse.json();
  const tokenBalances = tokenData.result.tokenBalances;

  // Fetch native ETH balance
  const ethResponse = await fetch(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [address, "latest"],
    }),
  });
  const ethData = await ethResponse.json();
  const ethBalance = BigInt(ethData.result).toString();

  const allTokens = [
    { contractAddress: "0x0000000000000000000000000000000000000000", tokenBalance: ethBalance },
    ...tokenBalances,
  ];

  const tokenMetadataPromises = allTokens.map((token) => fetchEVMTokenMetadata(token.contractAddress));
  const tokenMetadata = await Promise.all(tokenMetadataPromises);

  return allTokens.map((token, index) => ({
    token: token.contractAddress,
    balance: token.tokenBalance,
    ...tokenMetadata[index],
  }));
}

async function fetchEVMTokenMetadata(contractAddress: string): Promise<TokenMetadata> {
  if (contractAddress === "0x0000000000000000000000000000000000000000") {
    return {
      decimals: 18,
      name: "Ethereum",
      symbol: "ETH",
    };
  }

  const response = await fetch(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTokenMetadata",
      params: [contractAddress],
    }),
  });
  const data = await response.json();
  return data.result;
}

async function fetchSolanaTokenBalances(address: string): Promise<TokenBalance[]> {
  const connection = new Connection(SOLANA_RPC_ENDPOINT);
  const publicKey = new PublicKey(address);

  // Fetch native SOL balance
  const solBalance = await connection.getBalance(publicKey);
  const solTokenBalance: TokenBalance = {
    token: "11111111111111111111111111111111",
    balance: solBalance.toString(),
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
  };

  // Fetch SPL token balances
  const filter = {
    programId: TOKEN_PROGRAM_ID,
  };

  const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, filter);
  const tokenBalances = accounts.value.reduce(
    (acc, accountInfo) => {
      const amount = accountInfo.account.data.parsed.info.tokenAmount.amount;
      if (BigInt(amount) > BigInt(0)) {
        acc.push({
          token: accountInfo.account.data.parsed.info.mint,
          balance: amount,
        });
      }
      return acc;
    },
    [] as { token: string; balance: string }[],
  );

  const tokenMetadataPromises = tokenBalances.map((token) => fetchSolanaTokenMetadata(token.token));
  const tokenMetadata = await Promise.all(tokenMetadataPromises);

  const splTokenBalances = tokenBalances.map((token, index) => ({
    ...token,
    ...tokenMetadata[index],
  }));

  return [solTokenBalance, ...splTokenBalances];
}

async function fetchSolanaTokenMetadata(mintAddress: string): Promise<Partial<TokenMetadata>> {
  try {
    const response = await fetch(`https://tokens.jup.ag/token/${mintAddress}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      name: data.name,
      symbol: data.symbol,
      decimals: data.decimals,
      logo: data.logoURI,
    };
  } catch (error) {
    console.error(`Error fetching Solana token metadata for ${mintAddress}:`, error);
    return {};
  }
}

export function useEVMTokenBalances(chainId: number) {
  const { address } = useAccount();

  return useQuery<TokenBalance[], Error>({
    queryKey: ["evmTokenBalances", address, chainId],
    // biome-ignore lint/style/noNonNullAssertion: checked for in useQuery
    queryFn: () => fetchEVMTokenBalances(address!, chainId),
    enabled: !!address,
  });
}

export function useSolanaTokenBalances() {
  const { publicKey } = useWallet();

  return useQuery<TokenBalance[], Error>({
    queryKey: ["solanaTokenBalances", publicKey?.toBase58()],
    // biome-ignore lint/style/noNonNullAssertion: checked for in useQuery
    queryFn: () => fetchSolanaTokenBalances(publicKey!.toBase58()),
    enabled: !!publicKey,
  });
}
