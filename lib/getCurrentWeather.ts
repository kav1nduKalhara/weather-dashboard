export interface CurrentWeatherData {
  temperature: number;
  condition: string;
  feelsLike: number;
  high: number;
  low: number;
  humidity: number;
  windSpeed: string;
  pressure: string;
  visibility: string;
}

export async function getCurrentWeather(
  location: string
): Promise<CurrentWeatherData> {
  const WEATHER_KEY = process.env.NEXT_PUBLIC_WHETHER_API_KEY;
  if (!WEATHER_KEY) throw new Error('Missing API key');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_KEY}&units=metric`;
  const apiResponse = await fetch(url);
  if (!apiResponse.ok)
    throw new Error(`Failed to fetch weather for ${location}`);
  const data = await apiResponse.json();
  return {
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].description,
    feelsLike: Math.round(data.main.feels_like),
    high: Math.round(data.main.temp_max),
    low: Math.round(data.main.temp_min),
    humidity: data.main.humidity,
    windSpeed: `${Math.round(data.wind.speed)} m/s`,
    pressure: `${data.main.pressure} hPa`,
    visibility: `${(data.visibility / 1000).toFixed(1)} km`,
  };
}
