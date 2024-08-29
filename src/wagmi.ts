import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { http, createConfig } from "wagmi";
import { arbitrum, base, mainnet, optimism } from "wagmi/chains";
import { injected, safe, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, arbitrum, base, optimism],
  multiInjectedProviderDiscovery: false,
  connectors: [
    injected({
      unstable_shimAsyncInject: 2_000,
    }),
    metaMask(),
    safe(),
  ],
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
