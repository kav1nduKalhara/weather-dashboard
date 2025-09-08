'use client';

import { Search, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface WeatherHeaderProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export function WeatherHeader({
  selectedLocation,
  onLocationChange,
}: WeatherHeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const location = searchValue.trim();
    if (!location) return;
    onLocationChange(location);
    setSearchValue('');
  };

  return (
    <Card className="p-6 bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-100">
            <MapPin className="h-5 w-5 text-blue-400" />
            <h1 className="text-xl font-semibold">{selectedLocation}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search location..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:bg-slate-700 focus:border-blue-400 shadow-sm"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm font-medium"
            >
              Search
            </Button>
          </form>

          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:bg-slate-700 hover:text-slate-100 shadow-sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
