import BigNumber from "bignumber.js";

const formatAmount = (value: string, decimals: number) => {
  const bn = new BigNumber(value);
  if (bn.isNaN()) return "0";
  return bn.div(new BigNumber(10).pow(decimals)).toFixed(6);
};

export { formatAmount };
