import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { http, createConfig } from "wagmi";
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, arbitrum, base, optimism, polygon],
  multiInjectedProviderDiscovery: false,
  connectors: [
    injected({
      unstable_shimAsyncInject: 2_000,
    }),
    metaMask({
      useDeeplink: false,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
  },
});

export const solanaNetwork = WalletAdapterNetwork.Mainnet;
export const solanaEndpoint = clusterApiUrl(solanaNetwork);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
