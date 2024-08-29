/// <reference types="vite-plugin-svgr/client" />
import type React from "react";

import ARBSVG from "@web3icons/core/svgs/tokens/branded/ARBI.svg?react";
import ETH from "@web3icons/core/svgs/tokens/branded/ETH.svg?react";
import MATIC from "@web3icons/core/svgs/tokens/branded/MATIC.svg?react";
import SOL from "@web3icons/core/svgs/tokens/branded/SOL.svg?react";
// we need to import the svg files directly to prevent all svgs from being bundled with the app
import USDCSVG from "@web3icons/core/svgs/tokens/branded/USDC.svg?react";
import USDT from "@web3icons/core/svgs/tokens/branded/USDT.svg?react";
import CubeSVG from "../../assets/cube.svg?react";

interface TokenIconProps extends React.SVGProps<SVGSVGElement> {
  iconName: string;
}

export const tokenIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  usdc: USDCSVG,
  arb: ARBSVG,
  usdt: USDT,
  eth: ETH,
  sol: SOL,
  matic: MATIC,
};

const TokenIcon: React.FC<TokenIconProps> = ({ iconName, ...props }) => {
  const IconComponent = tokenIcons[iconName as keyof typeof tokenIcons];

  if (!IconComponent) {
    return <CubeSVG className="w-6 h-6" {...props} />;
  }

  return <IconComponent {...props} />;
};

export default TokenIcon;
