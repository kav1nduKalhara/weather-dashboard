'use client';

import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Cloudy,
} from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size?: 'small' | 'medium' | 'large';
}

export function WeatherIcon({ condition, size = 'medium' }: WeatherIconProps) {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-16 w-16',
  };

  const iconClass = `${sizeClasses[size]} drop-shadow-lg`;

  const getIcon = () => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className={`${iconClass} text-amber-400`} />;
      case 'partly cloudy':
      case 'partly-cloudy':
        return <Cloudy className={`${iconClass} text-slate-300`} />;
      case 'cloudy':
      case 'overcast':
        return <Cloud className={`${iconClass} text-slate-400`} />;
      case 'rainy':
      case 'rain':
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'drizzle':
        return <CloudDrizzle className={`${iconClass} text-blue-300`} />;
      case 'snow':
      case 'snowy':
        return <CloudSnow className={`${iconClass} text-slate-200`} />;
      case 'thunderstorm':
      case 'stormy':
        return <CloudLightning className={`${iconClass} text-purple-400`} />;
      default:
        return <Sun className={`${iconClass} text-amber-400`} />;
    }
  };

  return <div className="flex items-center justify-center">{getIcon()}</div>;
}
