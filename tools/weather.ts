export async function getWeather(location: string) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`,
  );

  if (!geoRes.ok) {
    throw new Error(`Geocoding API error: ${geoRes.status}`);
  }

  const geo = await geoRes.json();

  if (!geo.results?.length) {
    throw new Error(`Location "${location}" not found`);
  }

  const { latitude, longitude, name, country } = geo.results[0];

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
  );

  if (!weatherRes.ok) {
    throw new Error(`Weather API error: ${weatherRes.status}`);
  }

  const weather = await weatherRes.json();

  return {
    location: `${name}, ${country}`,
    temperature: weather.current_weather.temperature,
    windspeed: weather.current_weather.windspeed,
    unit: "°C",
  };
}
