
import type { CryptoCurrency } from './types';

function generateChartData(basePrice: number): { date: string; price: number }[] {
  const data = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // Simulate historical data with some variance
    const priceFluctuation = basePrice * (1 + (Math.random() - 0.5) * (i / 7) * 0.5);
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(priceFluctuation.toFixed(4)),
    });
  }
  return data;
}

const mapCoinData = (coin: any): CryptoCurrency | null => {
    const quote = coin.quote?.USD;
    if (!coin || !quote) return null;
    return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: parseFloat(quote.price.toFixed(4)),
        percentChange1h: parseFloat(quote.percent_change_1h.toFixed(2)),
        percentChange24h: parseFloat(quote.percent_change_24h.toFixed(2)),
        percentChange7d: parseFloat(quote.percent_change_7d.toFixed(2)),
        logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
        marketCap: Math.round(quote.market_cap),
        volume24h: Math.round(quote.volume_24h),
        circulatingSupply: Math.round(coin.circulating_supply),
        rank: coin.cmc_rank,
        chartData: generateChartData(quote.price),
        fullyDilutedValuation: Math.round(quote.fully_diluted_valuation),
        volumeChange24h: parseFloat(quote.volume_change_24h.toFixed(2)),
        dateAdded: coin.date_added,
    }
};


export async function fetchCryptoData(): Promise<CryptoCurrency[]> {
  const apiKey = process.env.COINMARKETCAP_API_KEY;

  if (!apiKey) {
    console.error("CoinMarketCap API key is missing.");
    // Returning empty array and letting the UI handle it.
    return [];
  }
  
  const API_URL_LATEST = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100';
  const API_URL_VANRY = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=VANRY';

  try {
    const headers = {
      'X-CMC_PRO_API_KEY': apiKey,
      'Accept': 'application/json',
    };
    
    // Using cache: 'no-store' to ensure we always get the latest data
    const [latestResponse, vanryResponse] = await Promise.all([
      fetch(API_URL_LATEST, { headers, next: { revalidate: 0 } }),
      fetch(API_URL_VANRY, { headers, next: { revalidate: 0 } })
    ]);

    if (!latestResponse.ok) {
        if (latestResponse.status === 429) {
            console.warn("CoinMarketCap API rate limit exceeded. Data may be stale.");
            return []; // Return empty/stale data instead of throwing
        }
        const errorBody = await latestResponse.text();
        throw new Error(`API call for latest listings failed with status ${latestResponse.status}: ${errorBody}`);
    }

    if (!vanryResponse.ok) {
        if (vanryResponse.status === 429) {
            console.warn("CoinMarketCap API rate limit exceeded for VANRY. Data may be stale.");
            // We can continue with the main list if this one fails
        } else {
            const errorBody = await vanryResponse.text();
            throw new Error(`API call for VANRY failed with status ${vanryResponse.status}: ${errorBody}`);
        }
    }

    const latestJson = await latestResponse.json();
    const vanryJson = vanryResponse.ok ? await vanryResponse.json() : null;
    
    if (!latestJson.data) {
        console.error("Invalid data structure from CoinMarketCap API for latest listings:", latestJson);
        return [];
    }

    let cryptoData: CryptoCurrency[] = latestJson.data.map(mapCoinData).filter((c: CryptoCurrency | null): c is CryptoCurrency => c !== null);

    if (vanryJson && vanryJson.data && vanryJson.data.VANRY) {
        const vanryCoinData = Array.isArray(vanryJson.data.VANRY) ? vanryJson.data.VANRY[0] : vanryJson.data.VANRY;
        const vanryData = mapCoinData(vanryCoinData);
        
        if (vanryData) {
          const existingIndex = cryptoData.findIndex(coin => coin.id === vanryData.id);
          if (existingIndex !== -1) {
            cryptoData.splice(existingIndex, 1);
          }
          cryptoData.unshift(vanryData);
        }

    } else {
        console.warn("Could not fetch or parse VANRY data, it may not be in the top 100:", vanryJson?.status);
    }


    return cryptoData;
  } catch (error) {
    console.error("Failed to fetch crypto data from CoinMarketCap:", error);
    return [];
  }
}
