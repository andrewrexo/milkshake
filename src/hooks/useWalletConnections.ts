import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback } from "react";
import { type Connector, useAccount, useConnect } from "wagmi";
import { useAppStore } from "../store/useAppStore";

export const useWalletConnections = () => {
  const { connect } = useConnect();
  const { isConnected: isEVMConnected } = useAccount();
  const { connected: isSolanaConnected, connecting: connectingSolana } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();
  const { setConnected } = useAppStore();

  const connectEVM = useCallback(
    (connector: Connector) => {
      connect(
        { connector },
        {
          onSuccess: () => setConnected(true),
          onError: () => setConnected(false),
        },
      );
    },
    [connect, setConnected],
  );

  const connectSolana = useCallback(() => {
    if (isSolanaConnected || connectingSolana) {
      setConnected(true);
    } else {
      setSolanaModalVisible(true);
    }
  }, [isSolanaConnected, connectingSolana, setConnected, setSolanaModalVisible]);

  return {
    isEVMConnected,
    isSolanaConnected,
    connectingSolana,
    connectEVM,
    connectSolana,
  };
};
