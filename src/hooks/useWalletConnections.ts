import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback } from "react";
import { type Connector, useAccount, useConnect } from "wagmi";

export const useWalletConnections = () => {
  const { connect } = useConnect();
  const { isConnected: isEVMConnected, connector: evmConnector, address: evmAddress } = useAccount();
  const {
    connected: isSolanaConnected,
    connecting: connectingSolana,
    wallet: solanaWallet,
    publicKey: solanaAddress,
  } = useWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();

  const connectEVM = useCallback(
    (connector: Connector) => {
      connect({ connector });
    },
    [connect],
  );

  const connectSolana = useCallback(() => {
    if (!isSolanaConnected && !connectingSolana) {
      setSolanaModalVisible(true);
    }
  }, [isSolanaConnected, connectingSolana, setSolanaModalVisible]);

  return {
    isEVMConnected,
    isSolanaConnected,
    connectingSolana,
    evmConnector,
    evmAddress,
    solanaWallet,
    solanaAddress,
    connectEVM,
    connectSolana,
  };
};
