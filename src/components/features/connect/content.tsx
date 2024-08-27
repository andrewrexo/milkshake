import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { type Connector, useConnect } from "wagmi";
import Icon from "./icon";

const ConnectContent = () => {
  const { connectors, connect } = useConnect();

  const handleConnect = (connector: Connector) => {
    connect(
      { connector },
      {
        onSuccess: () => {
          // todo
        },
        onError: () => {
          // todo
        },
      }
    );
  };

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search wallets across 10+ networks"
            className="input pl-10"
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-light dark:text-secondary-dark" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {connectors.map((connector: Connector) => (
          <button
            key={connector.uid}
            onClick={() => handleConnect(connector)}
            className="btn-primary text-md py-4 hover-input"
          >
            <div className="flex items-center gap-2">
              <Icon connector={connector} />
              <span className="font-medium">{connector.name}</span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-secondary-light dark:text-secondary-dark">
        Can't find your wallet?{" "}
        <a href="#" className="text-primary-light dark:text-primary-dark">
          Reach out.
        </a>
      </p>

      <p className="mt-4 text-center text-xs text-secondary-light dark:text-secondary-dark">
        milkshake.ai
      </p>
    </div>
  );
};

export default ConnectContent;
