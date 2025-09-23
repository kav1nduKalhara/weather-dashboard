import { create } from 'zustand';
import { getCurrentWeather } from '@/lib/getCurrentWeather';
import { getHourlyForecast } from '@/lib/getHourlyForecast';
import { getWeeklyForecast } from '@/lib/getWeeklyForecast';
import {
  CurrentWeatherData,
  HourlyWeatherData,
  WeeklyWeatherData,
} from '@/lib/weatherData';

interface WeatherState {
  location: string;

  currentWeather: CurrentWeatherData | null;
  currentWeatherLoading: boolean;
  currentWeatherError: string | null;

  hourlyForecast: HourlyWeatherData[] | null;
  hourlyForecastLoading: boolean;
  hourlyForecastError: string | null;

  weeklyForecast: WeeklyWeatherData[] | null;
  weeklyForecastLoading: boolean;
  weeklyForecastError: string | null;

  setLocation: (location: string) => void;
  fetchCurrentWeather: (location: string) => Promise<void>;
  fetchHourlyForecast: (location: string) => Promise<void>;
  fetchWeeklyForecast: (location: string) => Promise<void>;
  fetchAllWeatherData: (location: string) => Promise<void>;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  location: 'New York',

  currentWeather: null,
  currentWeatherLoading: false,
  currentWeatherError: null,

  hourlyForecast: null,
  hourlyForecastLoading: false,
  hourlyForecastError: null,

  weeklyForecast: null,
  weeklyForecastLoading: false,
  weeklyForecastError: null,

  setLocation: (location: string) => {
    set({ location });
    get().fetchAllWeatherData(location);
  },

  fetchCurrentWeather: async (location: string) => {
    set({
      currentWeatherLoading: true,
      currentWeatherError: null,
    });

    try {
      const data = await getCurrentWeather(location);
      set({
        currentWeather: data,
        currentWeatherLoading: false,
      });
    } catch (error: any) {
      set({
        currentWeatherError: error.message,
        currentWeatherLoading: false,
        currentWeather: null,
      });
    }
  },

  fetchHourlyForecast: async (location: string) => {
    set({
      hourlyForecastLoading: true,
      hourlyForecastError: null,
    });

    try {
      const data = await getHourlyForecast(location);
      set({
        hourlyForecast: data,
        hourlyForecastLoading: false,
      });
    } catch (error: any) {
      set({
        hourlyForecastError: error.message,
        hourlyForecastLoading: false,
        hourlyForecast: null,
      });
    }
  },

  fetchWeeklyForecast: async (location: string) => {
    set({
      weeklyForecastLoading: true,
      weeklyForecastError: null,
    });

    try {
      const data = await getWeeklyForecast(location);
      set({
        weeklyForecast: data,
        weeklyForecastLoading: false,
      });
    } catch (error: any) {
      set({
        weeklyForecastError: error.message,
        weeklyForecastLoading: false,
        weeklyForecast: null,
      });
    }
  },

  fetchAllWeatherData: async (location: string) => {
    const { fetchCurrentWeather, fetchHourlyForecast, fetchWeeklyForecast } =
      get();

    await Promise.all([
      fetchCurrentWeather(location),
      fetchHourlyForecast(location),
      fetchWeeklyForecast(location),
    ]);
  },
}));
