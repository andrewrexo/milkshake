import { type Connector, useConnect } from "wagmi";
import Icon from "./icon";
import { useAppStore } from "../../../store/useAppStore";
import Networks from "./networks";
import {
  ArrowRightIcon,
  EnterIcon,
  PinTopIcon,
  ShuffleIcon,
} from "@radix-ui/react-icons";

const ConnectContent = () => {
  const { connectors, connect } = useConnect();
  const { setConnected, setCurrentPage, selectedNetwork } = useAppStore();

  const handleConnect = (connector: Connector) => {
    connect(
      { connector },
      {
        onSuccess: () => {
          setConnected(true);
          setCurrentPage("dashboard");
        },
        onError: () => {
          // Handle error
        },
      }
    );
  };

  return (
    <>
      <Networks />
      <div className="grid grid-cols-1 gap-2 rounded-lg">
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

      <div className="mt-4 pb-4 flex items-center">
        <div className="flex-grow border-t border-primary"></div>
        <span className="mx-4 text-sm text-muted">or</span>
        <div className="flex-grow border-t border-primary"></div>
      </div>
      <button
        onClick={() => setCurrentPage("swap")}
        className=" w-full btn-primary text-md py-4 hover-input flex items-center rounded-xl text-primary"
      >
        <span className="text-xl mr-2">🍦</span>
        Start without connecting
        <EnterIcon className="w-4 h-4 ml-auto" />
      </button>
    </>
  );
};

export default ConnectContent;
