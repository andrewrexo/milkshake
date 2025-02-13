import type { Connector } from "wagmi";
import NetworkIcon from "../../icons/network";
import WalletIcon, { walletIcons } from "../../icons/wallet";

const Icon = ({
  connector,
  ...props
}: { connector: Connector | { name: string; icon?: string; uid: string }; className?: string }) => {
  const icon = connector.icon;

  if (icon) {
    return <img src={icon} alt={connector.name} width={24} height={24} />;
  }

  if (connector.name && connector.name.toLowerCase() in walletIcons) {
    return <WalletIcon iconName={connector.name.toLowerCase()} {...props} />;
  }

  return <NetworkIcon iconName={connector.uid} {...props} />;
};

export default Icon;
