import { ArrowRightIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import NetworkIcon from "../../icons/network";

type StartButtonProps = {
  isEVMConnected: boolean;
  isSolanaConnected: boolean;
  onClick: () => void;
};

const StartButton = ({ isEVMConnected, isSolanaConnected, onClick }: StartButtonProps) => (
  <button
    onClick={onClick}
    type="button"
    className="w-full btn-primary bg-background text-md py-4 border-none hover-input flex gap-4 items-center rounded-xl text-primary"
  >
    <p className="font-medium transition-all duration-300 flex gap-2 items-center">
      Start swapping <ArrowRightIcon className="w-4 h-4 mt-0.5" />
    </p>
    <div className="flex gap-1 ml-auto">
      <div
        className={twMerge("relative transition-opacity duration-300", isSolanaConnected ? "opacity-100" : "opacity-0")}
      >
        <span className="flex items-center justify-center bg-surface rounded-full">
          <NetworkIcon iconName="solana" className="m-1 z-10" />
        </span>
      </div>
      <div
        className={twMerge("relative transition-opacity duration-300", isEVMConnected ? "opacity-100" : "opacity-0")}
      >
        <span className="flex items-center justify-center bg-surface rounded-full">
          <NetworkIcon iconName="ethereum" className="m-1 z-10" />
        </span>
      </div>
    </div>
  </button>
);

export default StartButton;
