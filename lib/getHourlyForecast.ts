export interface HourlyWeatherData {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

export async function getHourlyForecast(
  location: string
): Promise<HourlyWeatherData[]> {
  const WEATHER_KEY = process.env.NEXT_PUBLIC_WHETHER_API_KEY;
  if (!WEATHER_KEY) throw new Error('Missing API key');

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_KEY}&units=metric`;
  const apiResponse = await fetch(url);

  if (!apiResponse.ok)
    throw new Error(`Failed to fetch hourly forecast for ${location}`);

  const data = await apiResponse.json();

  return data.list.slice(0, 8).map((item: any, index: number) => {
    const date = new Date(item.dt * 1000);
    const time =
      index === 0
        ? 'Now'
        : date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          });

    return {
      time,
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].main.toLowerCase(),
      precipitation: Math.round((item.pop || 0) * 100),
    };
  });
}
