'use client';

import { useState } from 'react';
import { WeatherHeader } from '@/components/weather/WeatherHeader';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { WeatherMetrics } from '@/components/weather/WeatherMetrics';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeeklyForecast } from '@/components/weather/WeeklyForecast';
import { WeatherMap } from '@/components/weather/WeatherMap';

export default function WeatherDashboard() {
  const [selectedLocation, setSelectedLocation] = useState('New York, NY');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <WeatherHeader
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Weather Info */}
          <div className="xl:col-span-2 space-y-6">
            <CurrentWeather location={selectedLocation} />
            <HourlyForecast location={selectedLocation} />
            <WeeklyForecast location={selectedLocation} />
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            <WeatherMetrics />
            <WeatherMap />
          </div>
        </div>
      </div>
    </div>
  );
}
