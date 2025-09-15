// Dummy weather data for demonstration
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

export interface HourlyWeatherData {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

export interface WeeklyWeatherData {
  day: string;
  condition: string;
  high: number;
  low: number;
  precipitation: number;
}

export interface WeatherMetricsData {
  humidity: number;
  windSpeed: string;
  windDirection: string;
  windGusts: string;
  pressure: string;
  pressureTrend: 'rising' | 'falling' | 'steady';
  uvIndex: number;
}

export function getCurrentWeather(): CurrentWeatherData {
  return {
    temperature: 72,
    condition: 'partly cloudy',
    feelsLike: 75,
    high: 78,
    low: 65,
    humidity: 68,
    windSpeed: '8 mph',
    pressure: '30.15 in',
    visibility: '10 mi',
  };
}
export function getHourlyForecast(): HourlyWeatherData[] {
  const hours = [
    'Now',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
    '9 PM',
    '10 PM',
  ];
  const temperatures = [72, 74, 76, 75, 73, 71, 68, 66, 64, 62];
  const conditions = [
    'partly cloudy',
    'sunny',
    'sunny',
    'partly cloudy',
    'cloudy',
    'cloudy',
    'rainy',
    'rainy',
    'cloudy',
    'cloudy',
  ];
  const precipitation = [20, 10, 5, 15, 30, 40, 70, 80, 60, 40];

  return hours.map((hour, index) => ({
    time: hour,
    temperature: temperatures[index],
    condition: conditions[index],
    precipitation: precipitation[index],
  }));
}

export function getWeeklyForecast(): WeeklyWeatherData[] {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const conditions = [
    'partly cloudy',
    'sunny',
    'rainy',
    'cloudy',
    'sunny',
    'thunderstorm',
    'partly cloudy',
  ];
  const highs = [78, 82, 75, 70, 85, 73, 79];
  const lows = [65, 68, 62, 58, 72, 60, 66];
  const precipitation = [20, 5, 80, 45, 10, 90, 25];

  return days.map((day, index) => ({
    day,
    condition: conditions[index],
    high: highs[index],
    low: lows[index],
    precipitation: precipitation[index],
  }));
}

export function getWeatherMetrics(): WeatherMetricsData {
  return {
    humidity: 68,
    windSpeed: '8 mph',
    windDirection: 'NW',
    windGusts: '12 mph',
    pressure: '30.15 in',
    pressureTrend: 'rising',
    uvIndex: 6,
  };
}
