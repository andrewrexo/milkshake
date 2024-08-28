import { type Asset } from "../components/features/swap/asset-selection";

export const mockAssets: Asset[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    network: {
      name: "Ethereum",
      id: "ethereum",
    },
    balance: "1.5",
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    network: {
      name: "Ethereum",
      id: "ethereum",
    },
    balance: "1000",
  },
  {
    id: "arb",
    name: "Arbitrum",
    symbol: "ARB",
    network: {
      name: "Arbitrum",
      id: "arbitrum",
    },
    balance: "100",
  },
  {
    id: "matic",
    name: "Polygon",
    symbol: "MATIC",
    network: {
      name: "Polygon",
      id: "polygon",
    },
    balance: "500",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    network: {
      name: "Solana",
      id: "solana",
    },
    balance: "20",
  },
];
