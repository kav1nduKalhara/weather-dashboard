export interface WeatherMetricsData {
  humidity: number;
  windSpeed: string;
  windDirection: string;
  windGusts: string;
  pressure: string;
  pressureTrend: 'rising' | 'falling' | 'steady';
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

function getWindDirection(degree: number): string {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
}

export async function getWeatherMetrics(
  location: string
): Promise<WeatherMetricsData> {
  const WEATHER_KEY = process.env.NEXT_PUBLIC_WHETHER_API_KEY;
  if (!WEATHER_KEY) throw new Error('Missing API key');

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_KEY}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok)
    throw new Error(`Failed to fetch weather metrics for ${location}`);
  const weatherData = await weatherResponse.json();

  const lat = weatherData.coord.lat;
  const lon = weatherData.coord.lon;

  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}`;
  let uvIndex = 0;
  try {
    const uvResponse = await fetch(uvUrl);
    if (uvResponse.ok) {
      const uvData = await uvResponse.json();
      uvIndex = Math.round(uvData.value);
    }
  } catch (error) {
    console.error('Failed to fetch UV index:', error);
  }

  const pressureValue = weatherData.main.pressure;
  let pressureTrend: 'rising' | 'falling' | 'steady' = 'steady';
  if (pressureValue > 1020) {
    pressureTrend = 'rising';
  } else if (pressureValue < 1010) {
    pressureTrend = 'falling';
  }

  const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );
  const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return {
    humidity: weatherData.main.humidity,
    windSpeed: `${Math.round(weatherData.wind.speed * 2.237)} mph`, // Convert m/s to mph
    windDirection: getWindDirection(weatherData.wind.deg || 0),
    windGusts: weatherData.wind.gust
      ? `${Math.round(weatherData.wind.gust * 2.237)} mph`
      : `${Math.round(weatherData.wind.speed * 2.237 * 1.3)} mph`, // Estimate if not available
    pressure: `${(weatherData.main.pressure * 0.02953).toFixed(2)} in`, // Convert hPa to inHg
    pressureTrend,
    uvIndex,
    sunrise,
    sunset,
  };
}
