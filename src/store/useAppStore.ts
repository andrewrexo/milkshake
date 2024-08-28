import { type StateCreator, create } from "zustand";

export type Network = {
  id: string;
  name: string;
};

type Token = {
  id: string;
  name: string;
  network: Network;
  symbol: string;
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
  showModal: boolean;
  setConnected: (connected: boolean) => void;
  setCurrentPage: (page: "connect" | "dashboard" | "swap") => void;
  setSelectedNetwork: (network: Network | null) => void;
  setShowModal: (show: boolean) => void;
};

const defaultNetworks: Network[] = [
  { id: "ethereum", name: "Ethereum" },
  { id: "arbitrum", name: "Arbitrum" },
  { id: "solana", name: "Solana" },
  { id: "bsc", name: "BSC" },
  { id: "base", name: "Base" },
];

const defaultTokens: Token[] = [
  {
    id: "eth",
    name: "Ethereum",
    network: defaultNetworks[0],
    symbol: "ETH",
  },
  {
    id: "usdc",
    name: "USD Coin",
    network: defaultNetworks[2],
    symbol: "USDC",
  },
];

export const createSwapSlice: StateCreator<SwapState> = (set): SwapState => ({
  fromToken: defaultTokens[0],
  toToken: defaultTokens[1],
  fromAmount: "0",
  toAmount: "0",
  fromNetwork: defaultTokens[0].network,
  toNetwork: defaultTokens[1].network,
  setFromToken: (token: Token) => set({ fromToken: token, fromNetwork: token.network }),
  setToToken: (token: Token) => set({ toToken: token, toNetwork: token.network }),
  setFromAmount: (amount: string) => set({ fromAmount: amount }),
  setToAmount: (amount: string) => set({ toAmount: amount }),
  setFromNetwork: (network: Network) => set({ fromNetwork: network }),
  setToNetwork: (network: Network) => set({ toNetwork: network }),
});

export const createAppSlice: StateCreator<AppState> = (set): AppState => ({
  isConnected: false,
  currentPage: "connect",
  selectedNetwork: null,
  availableNetworks: defaultNetworks,
  showModal: false,
  setConnected: (connected: boolean) => set({ isConnected: connected }),
  setCurrentPage: (page: "connect" | "dashboard" | "swap") => set({ currentPage: page }),
  setSelectedNetwork: (network: Network | null) => set({ selectedNetwork: network }),
  setShowModal: (show: boolean) => set({ showModal: show }),
});

export const useAppStore = create<AppState & SwapState>()((...args) => ({
  ...createAppSlice(...args),
  ...createSwapSlice(...args),
}));
