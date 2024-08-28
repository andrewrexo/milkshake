import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { http, createConfig } from "wagmi";
import { arbitrum, base, mainnet, optimism } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, arbitrum, base, optimism],
  connectors: [injected(), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
});

export const solanaNetwork = WalletAdapterNetwork.Mainnet;
export const solanaEndpoint = clusterApiUrl(solanaNetwork);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
