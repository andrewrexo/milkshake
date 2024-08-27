import { Connector } from "wagmi";
import WalletIcon from "../../icons/wallet";

const Icon = ({ connector }: { connector: Connector }) => {
  const icon = connector.icon;

  if (icon) {
    return <img src={icon} alt={connector.name} width={24} height={24} />;
  }

  return <WalletIcon iconName={connector.id} />;
};

export default Icon;
