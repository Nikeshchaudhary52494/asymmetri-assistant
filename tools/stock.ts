export async function getStockPrice(symbol: string) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    throw new Error("ALPHA_VANTAGE_API_KEY is not set");
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  const res = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${cleanSymbol}&apikey=${apiKey}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) {
    throw new Error(`Alpha Vantage API error: ${res.status}`);
  }

  const data = await res.json();
  const quote = data["Global Quote"];

  if (!quote || !quote["05. price"]) {
    throw new Error(`Symbol "${cleanSymbol}" not found or API limit reached`);
  }

  const price = parseFloat(quote["05. price"]);
  const change = parseFloat(quote["09. change"]);
  const changesPercentage = parseFloat(
    quote["10. change percent"].replace("%", ""),
  );
  const prevClose = parseFloat(quote["08. previous close"]);
  const volume = parseInt(quote["06. volume"]);

  return {
    symbol: quote["01. symbol"],
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changesPercentage: Number(changesPercentage.toFixed(2)),
    prevClose: Number(prevClose.toFixed(2)),
    volume,
    latestTradingDay: quote["07. latest trading day"],
    currency: "USD",
    source: "Alpha Vantage",
  };
}
