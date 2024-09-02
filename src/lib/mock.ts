import { defaultNetworks } from "../store/useAppStore";
import type { Asset } from "../components/features/swap/asset-selection";

export const mockAssets: Asset[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    network: defaultNetworks[0],
    balance: "1.5",
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    network: defaultNetworks[0],
    balance: "1000",
  },
  {
    id: "arb",
    name: "Arbitrum",
    symbol: "ARB",
    network: defaultNetworks[1],
    balance: "100",
  },
  {
    id: "matic",
    name: "Polygon",
    symbol: "MATIC",
    network: defaultNetworks[4],
    balance: "500",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    network: defaultNetworks[5],
    balance: "20",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    network: defaultNetworks[5],
    balance: "125",
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    network: defaultNetworks[5],
    balance: "50.2111",
  },
];
