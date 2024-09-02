import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";
import type { Chain } from "viem/chains";
import type { config } from "../wagmi";

export const supportedEVMNetworks = {
  mainnet: mainnet,
  arbitrum: arbitrum,
  base: base,
  optimism: optimism,
  polygon: polygon,
} as const;

const supportedNetworks = {
  ...Object.fromEntries(
    Object.entries(supportedEVMNetworks).map(([key, network]) => [key, { ...network, chainId: network.id }]),
  ),
  solana: {
    name: "Solana",
    network: "solana",
    id: 0,
    nativeCurrency: {
      name: "SOL",
      symbol: "SOL",
      decimals: 9,
    },
    rpcUrls: {
      default: { http: ["https://api.mainnet-beta.solana.com"] },
    },
    blockExplorers: {
      default: { name: "Solana Explorer", url: "https://explorer.solana.com" },
    },
  },
} as const;

type SupportedNetwork = keyof typeof supportedNetworks;
type SupportedChainId = (typeof config)["chains"][number]["id"];

const getEVMChainReferenceById = (chainId: number): Chain | undefined => {
  return Object.values(supportedEVMNetworks).find((network) => "id" in network && network.id === chainId);
};

export type { SupportedNetwork, SupportedChainId };
export { supportedNetworks, getEVMChainReferenceById };
