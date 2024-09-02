import { type StateCreator, create } from "zustand";
import { type SupportedNetwork, supportedNetworks } from "../lib/supported-networks";
import type { Asset } from "../components/features/swap/asset-selection";
import type { config } from "../wagmi";

export type Network = {
  id: SupportedNetwork;
  name: string;
  nativeTokenSymbol: string;
  chainId: (typeof config)["chains"][number]["id"];
};

export type Token = {
  id: string;
  name: string;
  network: Network;
  symbol: string;
  decimals?: number;
  isNative?: boolean;
};

type SwapState = {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string | null;
  fromNetwork: Network;
  toNetwork: Network;
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setFromNetwork: (network: Network) => void;
  setToNetwork: (network: Network) => void;
};

type BridgeState = {
  bridgeFromNetwork: Network | null;
  bridgeToNetwork: Network | null;
  bridgeFromToken: Asset | null;
  bridgeAmount: string;
  bridgeSlippage: number;
  setBridgeFromNetwork: (network: Network | null) => void;
  setBridgeToNetwork: (network: Network | null) => void;
  setBridgeFromToken: (token: Asset | null) => void;
  setBridgeAmount: (amount: string) => void;
  setBridgeSlippage: (slippage: number) => void;
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

export const defaultNetworks: Network[] = Object.entries(supportedNetworks).map(([id, network]) => ({
  id: id as SupportedNetwork,
  name: network.name,
  nativeTokenSymbol: network.nativeCurrency.symbol,
  chainId: network.id as Network["chainId"],
}));

const defaultTokens: Token[] = [
  {
    id: "eth",
    name: "Ethereum",
    network: defaultNetworks[0],
    symbol: "ETH",
    decimals: 18,
    isNative: true,
  },
  {
    id: "usdc",
    name: "USD Coin",
    network: defaultNetworks[1],
    symbol: "USDC",
    decimals: 6,
    isNative: false,
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

export const createBridgeSlice: StateCreator<BridgeState> = (set): BridgeState => ({
  bridgeFromNetwork: defaultNetworks[0],
  bridgeToNetwork: defaultNetworks[1],
  bridgeFromToken: defaultTokens[0],
  bridgeAmount: "",
  bridgeSlippage: 0.5,
  setBridgeFromNetwork: (network: Network | null) => set({ bridgeFromNetwork: network }),
  setBridgeToNetwork: (network: Network | null) => set({ bridgeToNetwork: network }),
  setBridgeFromToken: (token: Asset | null) => set({ bridgeFromToken: token }),
  setBridgeAmount: (amount) => set({ bridgeAmount: amount }),
  setBridgeSlippage: (slippage) => set({ bridgeSlippage: slippage }),
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

export const useAppStore = create<AppState & SwapState & BridgeState>()((...args) => ({
  ...createAppSlice(...args),
  ...createSwapSlice(...args),
  ...createBridgeSlice(...args),
}));
