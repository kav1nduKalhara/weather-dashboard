'use client';

import { Card } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { useWeatherStore } from '@/stores/weatherStore';
import { useEffect } from 'react';

interface CurrentWeatherProps {
  location: string;
}

export function CurrentWeather({ location }: CurrentWeatherProps) {
  const {
    currentWeather,
    currentWeatherLoading: loading,
    currentWeatherError: error,
    fetchCurrentWeather,
  } = useWeatherStore();

  useEffect(() => {
    if (location) {
      fetchCurrentWeather(location);
    }
  }, [location, fetchCurrentWeather]);

  if (loading) {
    return (
      <Card className="p-8 bg-slate-800/90 backdrop-blur-sm border-slate-700 text-slate-100 shadow-xl">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-slate-300">
              Loading weather data for {location}...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 bg-slate-800/90 backdrop-blur-sm border-slate-700 text-slate-100 shadow-xl">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-red-400 mb-2">Error loading weather data</p>
            <p className="text-slate-300 text-sm">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!currentWeather) {
    return (
      <Card className="p-8 bg-slate-800/90 backdrop-blur-sm border-slate-700 text-slate-100 shadow-xl">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-slate-300">No weather data available</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-slate-800/90 backdrop-blur-sm border-slate-700 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-slate-100">
            Current Weather
          </h2>
          <p className="text-sm text-slate-300">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-300">Last updated</p>
          <p className="text-sm text-slate-100">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <WeatherIcon condition={currentWeather.condition} size="large" />
            <div>
              <div className="text-6xl font-light text-slate-100">
                {currentWeather.temperature}°
              </div>
              <div className="text-lg text-slate-200 capitalize">
                {currentWeather.condition}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span>Feels like {currentWeather.feelsLike}°</span>
            <span>•</span>
            <span>H: {currentWeather.high}°</span>
            <span>L: {currentWeather.low}°</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center shadow-sm border border-slate-600">
            <div className="text-2xl font-semibold text-blue-400">
              {currentWeather.humidity}%
            </div>
            <div className="text-sm text-slate-300">Humidity</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center shadow-sm border border-slate-600">
            <div className="text-2xl font-semibold text-emerald-400">
              {currentWeather.windSpeed}
            </div>
            <div className="text-sm text-slate-300">Wind Speed</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center shadow-sm border border-slate-600">
            <div className="text-2xl font-semibold text-purple-400">
              {currentWeather.pressure}
            </div>
            <div className="text-sm text-slate-300">Pressure</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center shadow-sm border border-slate-600">
            <div className="text-2xl font-semibold text-amber-400">
              {currentWeather.visibility}
            </div>
            <div className="text-sm text-slate-300">Visibility</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
