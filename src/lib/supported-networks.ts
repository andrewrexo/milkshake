import { arbitrum, base, mainnet, optimism } from "viem/chains";
import type { Chain } from "viem/chains";

const supportedEVMNetworks = {
  mainnet: mainnet,
  arbitrum: arbitrum,
  base: base,
  optimism: optimism,
} as const;

const supportedNetworks = {
  ...supportedEVMNetworks,
  solana: {
    name: "Solana",
    network: "solana",
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

const getEVMChainReferenceById = (chainId: number): Chain | undefined => {
  return Object.values(supportedEVMNetworks).find((network) => "id" in network && network.id === chainId);
};

export type { SupportedNetwork };
export { supportedNetworks, getEVMChainReferenceById };
