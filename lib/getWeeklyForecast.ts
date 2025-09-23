import { WeeklyWeatherData } from './weatherData';

export async function getWeeklyForecast(
  location: string
): Promise<WeeklyWeatherData[]> {
  const WEATHER_KEY = process.env.NEXT_PUBLIC_WHETHER_API_KEY;
  if (!WEATHER_KEY) throw new Error('Missing API key');

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_KEY}&units=metric`;
  const apiResponse = await fetch(url);

  if (!apiResponse.ok)
    throw new Error(`Failed to fetch weekly forecast for ${location}`);

  const data = await apiResponse.json();
  const dailyData: { [key: string]: any } = {};

  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: date,
        temps: [],
        conditions: [],
        precipitations: [],
      };
    }

    dailyData[dateKey].temps.push(item.main.temp);
    dailyData[dateKey].conditions.push(item.weather[0].description);
    dailyData[dateKey].precipitations.push((item.pop || 0) * 100);
  });

  return Object.values(dailyData).map((dayData: any, index: number) => {
    const temps = dayData.temps;
    const precipitations = dayData.precipitations;

    return {
      day:
        index === 0
          ? 'Today'
          : dayData.date.toLocaleDateString('en-US', { weekday: 'long' }),
      condition: dayData.conditions[Math.floor(dayData.conditions.length / 2)],
      high: Math.round(Math.max(...temps)),
      low: Math.round(Math.min(...temps)),
      precipitation: Math.round(Math.max(...precipitations)),
    };
  });
}
