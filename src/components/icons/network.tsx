/// <reference types="vite-plugin-svgr/client" />
import type React from "react";

import ArbitrumSVG from "@web3icons/core/svgs/networks/branded/arbitrum-one.svg?react";
import BaseSVG from "@web3icons/core/svgs/networks/branded/base.svg?react";
import BscSVG from "@web3icons/core/svgs/networks/branded/binance-smart-chain.svg?react";
// we need to import the svg files directly to prevent all svgs from being bundled with the app
import EthereumSVG from "@web3icons/core/svgs/networks/branded/ethereum.svg?react";
import OptimismSVG from "@web3icons/core/svgs/networks/branded/optimism.svg?react";
import PolygonSVG from "@web3icons/core/svgs/networks/branded/polygon-pos.svg?react";
import SolanaSVG from "@web3icons/core/svgs/networks/branded/solana.svg?react";
import CubeSVG from "../../assets/cube.svg?react";

interface NetworkIconProps extends React.SVGProps<SVGSVGElement> {
  iconName: string;
}

const networkIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  ethereum: EthereumSVG,
  arbitrum: ArbitrumSVG,
  base: BaseSVG,
  solana: SolanaSVG,
  sol: SolanaSVG,
  evm: EthereumSVG,
  bsc: BscSVG,
  polygon: PolygonSVG,
  optimism: OptimismSVG,
};

const NetworkIcon: React.FC<NetworkIconProps> = ({ iconName, ...props }) => {
  const IconComponent = networkIcons[iconName as keyof typeof networkIcons];

  if (!IconComponent) {
    return <CubeSVG className="w-6 h-6" {...props} />;
  }

  return <IconComponent {...props} />;
};

export default NetworkIcon;
