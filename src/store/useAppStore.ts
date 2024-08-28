import { create } from "zustand";

export type Network = {
  id: string;
  name: string;
  iconName: string;
};

type Token = {
  id: string;
  name: string;
  iconName: string;
};

type SwapState = {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string | null;
  toAmount: string | null;
  fromNetwork: Network | null;
  toNetwork: Network | null;
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setFromNetwork: (network: Network) => void;
  setToNetwork: (network: Network) => void;
};

type AppState = {
  isConnected: boolean;
  currentPage: "connect" | "dashboard" | "swap";
  selectedNetwork: Network | null;
  availableNetworks: Network[];
  setConnected: (connected: boolean) => void;
  setCurrentPage: (page: "connect" | "dashboard" | "swap") => void;
  setSelectedNetwork: (network: Network | null) => void;
};

const defaultNetworks: Network[] = [
  { id: "ethereum", name: "Ethereum", iconName: "ethereum" },
  { id: "arbitrum", name: "Arbitrum", iconName: "arbitrum" },
  { id: "solana", name: "Solana", iconName: "solana" },
  { id: "bsc", name: "BSC", iconName: "bsc" },
  { id: "base", name: "Base", iconName: "base" },
];

const defaultTokens: Token[] = [
  { id: "USDC", name: "USDC", iconName: "USDC" },
  { id: "ETH", name: "Ethereum", iconName: "ETH" },
];

export const createSwapSlice = (set: any): SwapState => ({
  fromToken: defaultTokens[0],
  toToken: defaultTokens[1],
  fromAmount: "0",
  toAmount: "0",
  fromNetwork: defaultNetworks[0],
  toNetwork: defaultNetworks[1],
  setFromToken: (token: Token) => set({ fromToken: token }),
  setToToken: (token: Token) => set({ toToken: token }),
  setFromAmount: (amount: string) => set({ fromAmount: amount }),
  setToAmount: (amount: string) => set({ toAmount: amount }),
  setFromNetwork: (network: Network) => set({ fromNetwork: network }),
  setToNetwork: (network: Network) => set({ toNetwork: network }),
});

export const createAppSlice = (set: any): AppState => ({
  isConnected: false,
  currentPage: "connect",
  selectedNetwork: null,
  availableNetworks: defaultNetworks,
  setConnected: (connected: boolean) => set({ isConnected: connected }),
  setCurrentPage: (page: "connect" | "dashboard" | "swap") =>
    set({ currentPage: page }),
  setSelectedNetwork: (network: Network | null) =>
    set({ selectedNetwork: network }),
});

export const useAppStore = create<AppState & SwapState>((set) => ({
  ...createAppSlice(set),
  ...createSwapSlice(set),
}));
