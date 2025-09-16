'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Layers, Satellite, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  getWeatherMap,
  WeatherMapResponse,
  WeatherMapLayer,
} from '@/lib/getWeatherMap';

interface WeatherMapProps {
  location: string;
}

export function WeatherMap({ location }: WeatherMapProps) {
  const [mapData, setMapData] = useState<WeatherMapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'layers' | 'satellite'>(
    'map'
  );
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(['temperature', 'precipitation'])
  );

  useEffect(() => {
    fetchWeatherMap();
  }, [location]);

  const fetchWeatherMap = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherMap(location);
      setMapData(data);
    } catch (error: any) {
      setError(error.message);
      setMapData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleLayerVisibility = (layerType: string) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerType)) {
        newSet.delete(layerType);
      } else {
        newSet.add(layerType);
      }
      return newSet;
    });
  };

  const getActiveLayerData = (): WeatherMapLayer[] => {
    if (!mapData) return [];
    return mapData.layers.filter(layer => visibleLayers.has(layer.type));
  };

  if (loading) {
    return (
      <Card className="p-6 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-slate-400" />
            <p className="text-slate-300">
              Loading weather map data for {location}...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Map className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-slate-300">Unable to load weather map</p>
            <p className="text-sm text-slate-400 mt-1">{error}</p>
            <Button
              onClick={fetchWeatherMap}
              variant="ghost"
              size="sm"
              className="mt-2 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Weather Map</h3>
          <p className="text-xs text-slate-400">
            {mapData?.coord.lat.toFixed(2)}°, {mapData?.coord.lon.toFixed(2)}°
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('map')}
            className={`text-slate-300 hover:bg-slate-700 hover:text-slate-100 ${
              activeView === 'map' ? 'bg-slate-700 text-slate-100' : ''
            }`}
          >
            <Map className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('layers')}
            className={`text-slate-300 hover:bg-slate-700 hover:text-slate-100 ${
              activeView === 'layers' ? 'bg-slate-700 text-slate-100' : ''
            }`}
          >
            <Layers className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('satellite')}
            className={`text-slate-300 hover:bg-slate-700 hover:text-slate-100 ${
              activeView === 'satellite' ? 'bg-slate-700 text-slate-100' : ''
            }`}
          >
            <Satellite className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchWeatherMap}
            className="text-slate-300 hover:bg-slate-700 hover:text-slate-100 ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="aspect-square bg-slate-700/30 rounded-lg flex flex-col justify-between border border-slate-600 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0">
          {getActiveLayerData().map((layer, index) => (
            <div
              key={layer.type}
              className="absolute inset-0 rounded-lg transition-opacity duration-300"
              style={{
                backgroundColor: layer.color,
                opacity: layer.opacity,
                zIndex: index + 1,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center text-slate-100">
          <div className="text-center">
            {activeView === 'map' && <Map className="h-12 w-12 mx-auto mb-2" />}
            {activeView === 'layers' && (
              <Layers className="h-12 w-12 mx-auto mb-2" />
            )}
            {activeView === 'satellite' && (
              <Satellite className="h-12 w-12 mx-auto mb-2" />
            )}
            <p className="text-sm font-medium">
              {activeView === 'map' && 'Interactive Weather Map'}
              {activeView === 'layers' && 'Weather Layers'}
              {activeView === 'satellite' && 'Satellite View'}
            </p>
            <p className="text-xs mt-1 capitalize">
              {mapData?.weather.condition}
            </p>
            <p className="text-xs">{mapData?.weather.temperature}°C</p>
          </div>
        </div>

        {getActiveLayerData().length > 0 && (
          <div className="relative z-10 p-3 bg-slate-800/80 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2 text-xs">
              {getActiveLayerData().map(layer => (
                <div key={layer.type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded border border-slate-500"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="text-slate-200">
                    {layer.name}: {layer.value}
                    {layer.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-200">Weather Layers</h4>
          <span className="text-xs text-slate-400">
            Updated:{' '}
            {mapData
              ? new Date(mapData.lastUpdated).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '--'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mapData?.layers.map(layer => (
            <Button
              key={layer.type}
              variant="ghost"
              size="sm"
              onClick={() => toggleLayerVisibility(layer.type)}
              className={`justify-start text-xs px-2 py-1 h-auto ${
                visibleLayers.has(layer.type)
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                {visibleLayers.has(layer.type) ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
                <div
                  className="w-3 h-3 rounded border border-slate-500 flex-shrink-0"
                  style={{ backgroundColor: layer.color }}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium">{layer.name}</div>
                  <div className="text-xs opacity-75">
                    {layer.value}
                    {layer.unit}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
