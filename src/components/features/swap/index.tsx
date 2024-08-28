import {
  ArchiveIcon,
  ArrowDownIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import { useAppStore } from "../../../store/useAppStore";
import TokenIcon from "../../icons/token";
import NetworkIcon from "../../icons/network";

const Swap = () => {
  const { setCurrentPage } = useAppStore();

  const {
    toToken,
    fromToken,
    setToToken,
    setFromToken,
    toNetwork,
    fromNetwork,
  } = useAppStore((state) => ({
    toToken: state.toToken,
    fromToken: state.fromToken,
    setToToken: state.setToToken,
    setFromToken: state.setFromToken,
    toNetwork: state.toNetwork,
    fromNetwork: state.fromNetwork,
  }));

  return (
    <div className="flex flex-col h-full pb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentPage("connect")}
          className="text-2xl font-bold"
        >
          ←
        </button>
        <h2 className="text-xl font-bold">Transfer</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-input">
            <ArchiveIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 mb-4">
        <div className="bg-input rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">From</span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
            />
            <button className="flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <span>Select token</span>
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="p-2 rounded-full bg-surface hover:bg-hover">
            <ArrowDownIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-input rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">To</span>

            <span className="text-sm text-muted font-medium">
              {toNetwork?.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
              readOnly
            />
            <button className="flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover">
              <TokenIcon iconName={toToken?.id ?? ""} className="w-6 h-6" />
              <span>{toToken?.id}</span>
            </button>
          </div>
        </div>
      </div>{" "}
      <div className="bg-surface rounded-lg my-2">
        <h3 className="text-lg font-semibold mb-2">Transfer Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Estimated Fee:</span>
            <span className="font-medium">0.001 ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Time:</span>
            <span className="font-medium">~2 minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Route:</span>
            <div className="flex items-center space-x-1">
              <NetworkIcon iconName="ethereum" className="w-4 h-4" />
              <ArrowRightIcon className="w-4 h-4" />
              <NetworkIcon iconName="solana" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      <button className="btn-primary text-center py-3 mt-auto">Transfer</button>
    </div>
  );
};

export default Swap;
