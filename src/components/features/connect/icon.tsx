import type { Connector } from "wagmi";
import NetworkIcon from "../../icons/network";
import WalletIcon from "../../icons/wallet";

const Icon = ({ connector }: { connector: Connector | { name: string; icon?: string } }) => {
  const icon = connector.icon;

  if (icon) {
    return <img src={icon} alt={connector.name} width={24} height={24} />;
  }

  if (connector.name === "Solana") {
    return <NetworkIcon iconName="solana" />;
  }

  return <WalletIcon iconName={connector.name} />;
};

export default Icon;
