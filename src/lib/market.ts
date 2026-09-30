export type Ticker = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  low: number;
  high: number;
  volumeBrl: number;
};

export type MarketPayload = {
  tickers: Ticker[];
  updatedAt: string;
  live: boolean;
};

export const ASSETS = [
  { pair: "USDTBRL", symbol: "USDT", name: "Tether" },
  { pair: "BTCBRL", symbol: "BTC", name: "Bitcoin" },
  { pair: "ETHBRL", symbol: "ETH", name: "Ethereum" },
  { pair: "SOLBRL", symbol: "SOL", name: "Solana" },
  { pair: "XRPBRL", symbol: "XRP", name: "XRP" },
  { pair: "USDCBRL", symbol: "USDC", name: "USD Coin" },
] as const;

/** Usado quando a API externa estiver indisponível. */
export const FALLBACK: Ticker[] = [
  { symbol: "USDT", name: "Tether", price: 5.22, change24h: -0.04, low: 5.21, high: 5.25, volumeBrl: 0 },
  { symbol: "BTC", name: "Bitcoin", price: 436600, change24h: -0.53, low: 433775, high: 441132, volumeBrl: 0 },
  { symbol: "ETH", name: "Ethereum", price: 14046, change24h: -0.27, low: 13882, high: 14320, volumeBrl: 0 },
  { symbol: "SOL", name: "Solana", price: 620.89, change24h: 0.56, low: 614.15, high: 640.2, volumeBrl: 0 },
  { symbol: "XRP", name: "XRP", price: 7.81, change24h: 1.08, low: 7.71, high: 8.12, volumeBrl: 0 },
  { symbol: "USDC", name: "USD Coin", price: 5.22, change24h: 0.02, low: 5.21, high: 5.24, volumeBrl: 0 },
];

export const TICKER_URL = "https://brasilbitcoin.com.br/api/v2/ticker24h";

type Raw = {
  pair: string;
  lastPrice: string | number;
  var: string | number;
  lowPrice: string | number;
  highPrice: string | number;
  brlVolume: string | number;
};

export async function fetchMarket(): Promise<MarketPayload> {
  try {
    const res = await fetch(TICKER_URL, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`ticker ${res.status}`);
    const raw = (await res.json()) as Raw[];
    const byPair = new Map(raw.map((r) => [r.pair, r]));

    const tickers = ASSETS.map((a): Ticker | null => {
      const r = byPair.get(a.pair);
      if (!r) return null;
      return {
        symbol: a.symbol,
        name: a.name,
        price: Number(r.lastPrice),
        change24h: Number(r.var),
        low: Number(r.lowPrice),
        high: Number(r.highPrice),
        volumeBrl: Number(r.brlVolume),
      };
    }).filter((t): t is Ticker => t !== null && Number.isFinite(t.price) && t.price > 0);

    if (tickers.length < 3) throw new Error("ticker incompleto");
    return { tickers, updatedAt: new Date().toISOString(), live: true };
  } catch {
    return { tickers: FALLBACK, updatedAt: new Date().toISOString(), live: false };
  }
}
