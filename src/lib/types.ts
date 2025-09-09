
export type CryptoCurrency = {
  id: number;
  name: string;
  symbol: string;
  price: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  logo: string;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  rank: number;
  chartData: { date: string; price: number }[];
  fullyDilutedValuation: number;
  volumeChange24h: number;
  dateAdded: string;
};

