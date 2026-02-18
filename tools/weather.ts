export async function getWeather(location: string) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY is not set");
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`,
  );

  if (res.status === 404) {
    throw new Error(`Location "${location}" not found`);
  }

  if (!res.ok) {
    throw new Error(`OpenWeather API error: ${res.status}`);
  }

  const data = await res.json();

  return {
    location: `${data.name}, ${data.sys.country}`,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windspeed: data.wind.speed,
    description: data.weather[0].description,
    unit: "°C",
  };
}
