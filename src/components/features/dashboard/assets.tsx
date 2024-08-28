import NetworkIcon from "../../icons/network";

export const Assets = () => {
  return (
    <div className="w-full space-y-3">
      {[
        { name: "Ethereum", symbol: "ETH", value: 1234.56, change: 2.5 },
        { name: "USDC", symbol: "USDC", value: 500.0, change: 0 },
        { name: "Arbitrum", symbol: "ARB", value: 250.75, change: -1.2 },
      ].map((asset, index) => (
        <div
          key={`${asset.name}-${index}`}
          className="flex items-center justify-between rounded-lg transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <NetworkIcon iconName={asset.name.toLowerCase()} className="w-8 h-8" />
            <div className="text-start">
              <p className="font-medium">{asset.name}</p>
              <p className="text-sm text-muted">{asset.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">${asset.value.toFixed(2)}</p>
            <p className={`text-sm ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {asset.change >= 0 ? "+" : ""}
              {asset.change}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
