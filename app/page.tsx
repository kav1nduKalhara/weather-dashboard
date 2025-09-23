'use client';

import { useEffect } from 'react';
import { WeatherHeader } from '@/components/weather/WeatherHeader';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { WeatherMetrics } from '@/components/weather/WeatherMetrics';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeeklyForecast } from '@/components/weather/WeeklyForecast';
import { WeatherMap } from '@/components/weather/WeatherMap';
import { useWeatherStore } from '@/stores/weatherStore';

export default function WeatherDashboard() {
  const { location, fetchAllWeatherData } = useWeatherStore();

  useEffect(() => {
    fetchAllWeatherData(location);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <WeatherHeader />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Weather Info */}
          <div className="xl:col-span-2 space-y-6">
            <CurrentWeather location={location} />
            <HourlyForecast location={location} />
            <WeeklyForecast location={location} />
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            <WeatherMetrics location={location} />
            <WeatherMap location={location} />
          </div>
        </div>
      </div>
    </div>
  );
}
