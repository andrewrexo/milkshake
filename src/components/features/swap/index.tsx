import { useState, useCallback } from "react";
import { ArchiveIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { useAppStore } from "../../../store/useAppStore";
import TokenIcon from "../../icons/token";
import AssetSelection from "./asset-selection";

const Swap = () => {
  const [selectingFor, setSelectingFor] = useState<"from" | "to">("from");
  const { setCurrentPage } = useAppStore();

  const {
    toToken,
    fromToken,
    setToToken,
    setFromToken,
    toNetwork,
    fromNetwork,
    setShowModal,
    showModal,
  } = useAppStore((state) => ({
    toToken: state.toToken,
    fromToken: state.fromToken,
    setToToken: state.setToToken,
    setFromToken: state.setFromToken,
    toNetwork: state.toNetwork,
    fromNetwork: state.fromNetwork,
    setShowModal: state.setShowModal,
    showModal: state.showModal,
  }));

  const handleSelectAsset = (asset: any) => {
    if (selectingFor === "from") {
      setFromToken({
        ...asset,
      });
    } else {
      setToToken({
        ...asset,
      });
    }
    setShowModal(false);
  };

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <div className="flex flex-col h-full pb-4 relative">
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
            <span className="text-sm text-muted font-medium">
              {fromNetwork?.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
            />
            <button
              className="flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover"
              onClick={() => {
                setSelectingFor("from");
                setShowModal(true);
              }}
            >
              {fromToken ? (
                <>
                  <TokenIcon iconName={fromToken.id} className="w-6 h-6" />
                  <span>{fromToken.symbol}</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <span>Select token</span>
                </>
              )}
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
              {toToken?.network?.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="0"
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
              readOnly
            />
            <button
              className="flex items-center space-x-2 bg-surface rounded-lg p-2 hover:bg-hover"
              onClick={() => {
                setSelectingFor("to");
                setShowModal(true);
              }}
            >
              {toToken ? (
                <>
                  <TokenIcon iconName={toToken.id} className="w-6 h-6" />
                  <span>{toToken.symbol}</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <span>Select token</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Network route</p>
            <p className="text-sm font-medium text-muted">
              {fromNetwork?.name} → {toNetwork?.name}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-medium">Arrival estimate</p>
            <p className="text-sm font-medium text-muted">Instantly</p>
          </div>
        </div>
      </div>
      <button className="btn-primary text-center py-3 mt-2">
        Create transfer
      </button>
      <AssetSelection
        isVisible={showModal}
        onClose={handleCloseModal}
        onSelect={handleSelectAsset}
      />
    </div>
  );
};

export default Swap;
