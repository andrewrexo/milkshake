import { supportedEVMNetworks, supportedNetworks } from "../lib/supported-networks";
import type { Network } from "../store/useAppStore";

export function getSupportedNetworks(): Network[] {
  return Object.entries(supportedEVMNetworks).map(([id, network]) => ({
    id: id as Network["id"],
    name: network.name,
    nativeTokenSymbol: network.nativeCurrency.symbol,
    chainId: network.id,
  }));
}

export function getSupportedNetworksAll() {
  return Object.entries(supportedNetworks).map(([id, network]) => ({
    id: id as Network["id"],
    name: network.name,
    nativeTokenSymbol: network.nativeCurrency.symbol,
    chainId: network.id,
  }));
}
