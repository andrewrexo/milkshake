import { useDisconnect } from "wagmi";
import { useAppStore } from "../../../store/useAppStore";

const Dashboard = () => {
  const { disconnect } = useDisconnect();
  const setConnected = useAppStore((state) => state.setConnected);
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);

  const handleDisconnect = () => {
    disconnect();
    setConnected(false);
    setCurrentPage("connect");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Dashboard</h2>
      <p className="text-center mb-4">Welcome to your dashboard!</p>
      <button
        onClick={handleDisconnect}
        className="btn-primary text-md py-2 px-4 w-full"
      >
        Disconnect
      </button>
    </div>
  );
};

export default Dashboard;
