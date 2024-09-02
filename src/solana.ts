import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const solanaNetwork = WalletAdapterNetwork.Mainnet;
export const solanaEndpoint = clusterApiUrl(solanaNetwork);
