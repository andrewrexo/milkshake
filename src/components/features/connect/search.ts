const fuzzySearch = (text: string, search: string) => {
  const searchLower = search.toLowerCase();
  const textLower = text.toLowerCase();
  let score = 0;
  let searchIndex = 0;

  for (let i = 0; i < textLower.length; i++) {
    if (textLower[i] === searchLower[searchIndex]) {
      score++;
      searchIndex++;
      if (searchIndex === searchLower.length) break;
    }
  }

  return score / searchLower.length;
};

export const search = (searchTerm: string) => {
  const evmNetworks = ["Ethereum", "Polygon", "Binance", "BSC", "Arbitrum"];
  const solanaNetwork = "Solana";

  if (searchTerm === "") {
    return { showEVMConnectors: true, showSolanaConnector: true, anyNetworkFound: true };
  }

  const evmScore = Math.max(...evmNetworks.map((network) => fuzzySearch(network, searchTerm)));
  const solanaScore = fuzzySearch(solanaNetwork, searchTerm);

  const threshold = 0.7; // Adjust this value to fine-tune matching sensitivity
  const showEVM = evmScore > threshold;
  const showSolana = solanaScore > threshold;

  return {
    showEVMConnectors: showEVM,
    showSolanaConnector: showSolana,
    anyNetworkFound: showEVM || showSolana,
  };
};
