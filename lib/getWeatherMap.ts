export interface WeatherMapData {
  temperature: number;
  precipitation: number;
  cloudCover: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  iconCode: string;
}

export interface WeatherMapLayer {
  type: 'temperature' | 'precipitation' | 'clouds' | 'wind' | 'pressure';
  name: string;
  opacity: number;
  visible: boolean;
  color: string;
  value: number;
  unit: string;
}

export interface WeatherMapResponse {
  coord: {
    lat: number;
    lon: number;
  };
  weather: WeatherMapData;
  layers: WeatherMapLayer[];
  lastUpdated: string;
}

export async function getWeatherMap(
  location: string
): Promise<WeatherMapResponse> {
  const WEATHER_KEY = process.env.NEXT_PUBLIC_WHETHER_API_KEY;
  if (!WEATHER_KEY) throw new Error('Missing API key');

  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${WEATHER_KEY}`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error(`Failed to get coordinates for ${location}`);
  }
  const geoData = await geoResponse.json();
  if (geoData.length === 0) {
    throw new Error(`Location not found: ${location}`);
  }

  const { lat, lon } = geoData[0];

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) {
    throw new Error(`Failed to fetch weather map data for ${location}`);
  }
  const weatherData = await weatherResponse.json();

  const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;
  let uvIndex = 0;
  try {
    const oneCallResponse = await fetch(oneCallUrl);
    if (oneCallResponse.ok) {
      const oneCallData = await oneCallResponse.json();
      uvIndex = oneCallData.current?.uvi || 0;
    }
  } catch (error) {
    console.warn('Could not fetch UV index data');
  }

  const weather: WeatherMapData = {
    temperature: Math.round(weatherData.main.temp),
    precipitation: weatherData.rain?.['1h'] || weatherData.snow?.['1h'] || 0,
    cloudCover: weatherData.clouds.all,
    windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
    windDirection: weatherData.wind.deg || 0,
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility / 1000, // Convert to km
    uvIndex: Math.round(uvIndex),
    condition: weatherData.weather[0].description,
    iconCode: weatherData.weather[0].icon,
  };

  const layers: WeatherMapLayer[] = [
    {
      type: 'temperature',
      name: 'Temperature',
      opacity: 0.7,
      visible: true,
      color: getTemperatureColor(weather.temperature),
      value: weather.temperature,
      unit: '°C',
    },
    {
      type: 'precipitation',
      name: 'Precipitation',
      opacity: weather.precipitation > 0 ? 0.8 : 0.3,
      visible: weather.precipitation > 0,
      color: getPrecipitationColor(weather.precipitation),
      value: weather.precipitation,
      unit: 'mm/h',
    },
    {
      type: 'clouds',
      name: 'Cloud Cover',
      opacity: (weather.cloudCover / 100) * 0.6,
      visible: weather.cloudCover > 20,
      color: getCloudColor(weather.cloudCover),
      value: weather.cloudCover,
      unit: '%',
    },
    {
      type: 'wind',
      name: 'Wind Speed',
      opacity: Math.min(weather.windSpeed / 50, 0.8),
      visible: weather.windSpeed > 10,
      color: getWindColor(weather.windSpeed),
      value: weather.windSpeed,
      unit: 'km/h',
    },
    {
      type: 'pressure',
      name: 'Pressure',
      opacity: 0.5,
      visible: false,
      color: getPressureColor(weather.pressure),
      value: weather.pressure,
      unit: 'hPa',
    },
  ];

  return {
    coord: { lat, lon },
    weather,
    layers,
    lastUpdated: new Date().toISOString(),
  };
}

function getTemperatureColor(temp: number): string {
  if (temp < 0) return '#4A90E2';
  if (temp < 10) return '#7ED321';
  if (temp < 20) return '#F5A623';
  if (temp < 30) return '#F8943A';
  return '#D0021B';
}

function getPrecipitationColor(precip: number): string {
  if (precip === 0) return 'transparent';
  if (precip < 0.5) return '#87CEEB';
  if (precip < 2) return '#4169E1';
  if (precip < 5) return '#0000FF';
  return '#191970';
}

function getCloudColor(cloudCover: number): string {
  const opacity = Math.min(cloudCover / 100, 0.8);
  return `rgba(156, 163, 175, ${opacity})`;
}

function getWindColor(windSpeed: number): string {
  if (windSpeed < 10) return '#E5E7EB';
  if (windSpeed < 25) return '#9CA3AF';
  if (windSpeed < 40) return '#6B7280';
  return '#374151';
}

function getPressureColor(pressure: number): string {
  if (pressure < 1000) return '#EF4444';
  if (pressure < 1020) return '#F59E0B';
  return '#10B981';
}
