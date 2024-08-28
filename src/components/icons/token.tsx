/// <reference types="vite-plugin-svgr/client" />
import React from "react";

// we need to import the svg files directly to prevent all svgs from being bundled with the app
import USDCSVG from "@web3icons/core/svgs/tokens/branded/USDC.svg?react";
import ARBSVG from "@web3icons/core/svgs/tokens/branded/ARBI.svg?react";
import USDT from "@web3icons/core/svgs/tokens/branded/USDT.svg?react";
import ETH from "@web3icons/core/svgs/tokens/branded/ETH.svg?react";
import CubeSVG from "../../assets/cube.svg?react";

interface TokenIconProps extends React.SVGProps<SVGSVGElement> {
  iconName: string;
}

const tokenIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  USDC: USDCSVG,
  ARB: ARBSVG,
  USDT: USDT,
  ETH: ETH,
};

const TokenIcon: React.FC<TokenIconProps> = ({ iconName, ...props }) => {
  const IconComponent = tokenIcons[iconName as keyof typeof tokenIcons];

  if (!IconComponent) {
    return <CubeSVG className="w-6 h-6" {...props} />;
  }

  return <IconComponent {...props} />;
};

export default TokenIcon;
