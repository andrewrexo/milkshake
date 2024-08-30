/// <reference types="vite-plugin-svgr/client" />
import type React from "react";

import CoinbaseSVG from "@web3icons/core/svgs/wallets/branded/coinbase.svg?react";
// we need to import the svg files directly to prevent all svgs from being bundled with the app
import MetamaskSVG from "@web3icons/core/svgs/wallets/branded/metamask.svg?react";
import TrustWalletSVG from "@web3icons/core/svgs/wallets/branded/trust.svg?react";
import WalletConnectSVG from "@web3icons/core/svgs/wallets/branded/wallet-connect.svg?react";

import CubeSVG from "../../assets/cube.svg?react";
import { CubeIcon } from "@radix-ui/react-icons";

interface WalletIconProps extends React.SVGProps<SVGSVGElement> {
  iconName: string;
}

export const walletIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  metamask: MetamaskSVG,
  coinbase: CoinbaseSVG,
  coinbaseWalletSDK: CoinbaseSVG,
  walletconnect: WalletConnectSVG,
  trustwallet: TrustWalletSVG,
  injected: CubeSVG,
};

const WalletIcon: React.FC<WalletIconProps> = ({ iconName, ...props }) => {
  const IconComponent = walletIcons[iconName as keyof typeof walletIcons];

  if (!IconComponent) {
    return <CubeIcon className="w-6 h-6" />;
  }

  return <IconComponent {...props} className="w-6 h-6" />;
};

export default WalletIcon;
