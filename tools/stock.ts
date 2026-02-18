export async function getStockPrice(symbol: string) {
  const cleanSymbol = symbol.trim().toUpperCase();

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}?interval=1d&range=1d`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      throw new Error(`Yahoo Finance error: ${res.status}`);
    }

    const data = await res.json();
    const result = data.chart?.result?.[0];

    if (!result?.meta) {
      throw new Error(`Invalid symbol: ${cleanSymbol}`);
    }

    const meta = result.meta;

    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose;

    if (price == null || prevClose == null) {
      throw new Error("Missing price data");
    }

    const change = price - prevClose;
    const changesPercentage = (change / prevClose) * 100;

    return {
      symbol: meta.symbol,
      name: meta.longName || meta.symbol,
      price,
      change: Number(change.toFixed(2)),
      changesPercentage: Number(changesPercentage.toFixed(2)),
      currency: meta.currency || "USD",
      source: "Yahoo Finance",
    };
  } catch (error) {
    console.error(`Stock lookup failed for ${cleanSymbol}:`, error);

    return {
      symbol: cleanSymbol,
      name: `${cleanSymbol} (Unavailable)`,
      price: 0,
      change: 0,
      changesPercentage: 0,
      currency: "USD",
      source: "Yahoo Finance Failed",
      error: true,
    };
  }
}
