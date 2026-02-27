"use client";

import { useState, useEffect, useRef } from "react";
import { useWeather } from "@/context/WeatherContext";
import { searchCities, GeocodingResult } from "@/services/weather";
import WeatherIcon from "@/components/WeatherIcon";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CitiesPage() {
  const {
    savedCities,
    cityWeatherMap,
    addCity,
    removeCity,
    setActiveCity,
  } = useWeather();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleSelectCity = (result: GeocodingResult) => {
    addCity({
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
  };

  const handleCityClick = (city: typeof savedCities[0]) => {
    setActiveCity(city);
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header with search */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-medium text-gray-900">Cities</h1>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showSearch ? <X size={16} /> : <Plus size={16} />}
          {showSearch ? "Cancel" : "Add City"}
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="relative mb-8">
          <div className="flex items-center border-b border-gray-200 pb-2">
            <Search size={16} className="text-gray-300 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="flex-1 text-sm text-gray-900 placeholder-gray-300 outline-none bg-transparent"
              autoFocus
            />
            {isSearching && (
              <Loader2 size={14} className="animate-spin text-gray-300" />
            )}
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-lg mt-2 shadow-sm z-10 overflow-hidden">
              {searchResults.map((result, i) => (
                <button
                  key={`${result.name}-${result.latitude}-${i}`}
                  onClick={() => handleSelectCity(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {result.name}
                  </span>
                  <span className="text-sm text-gray-400 ml-2">
                    {result.admin1 ? `${result.admin1}, ` : ""}
                    {result.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cities grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
        {savedCities.map((city) => {
          const weather = cityWeatherMap[city.name];

          return (
            <div
              key={city.name}
              className="group cursor-pointer relative"
              onClick={() => handleCityClick(city)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCity(city.name);
                }}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <X size={12} className="text-gray-300 hover:text-gray-500" />
              </button>

              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {city.name}
                  </h3>
                  <p className="text-xs text-gray-400">{city.country}</p>
                </div>
                {weather && (
                  <WeatherIcon
                    code={weather.current.weatherCode}
                    size={20}
                    isDay={weather.current.isDay}
                    className="text-gray-400 mt-1"
                  />
                )}
              </div>

              {weather ? (
                <div className="mt-2">
                  <span className="text-3xl font-light text-gray-900 tracking-tight">
                    {weather.current.temperature}°
                  </span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      H:{weather.daily[0]?.tempMax}°
                    </span>
                    <span className="text-xs text-gray-300">
                      L:{weather.daily[0]?.tempMin}°
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <Loader2
                    size={14}
                    className="animate-spin text-gray-200"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Add city placeholder */}
        {!showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className="flex flex-col items-center justify-center py-6 text-gray-200 hover:text-gray-400 transition-colors"
          >
            <Plus size={24} strokeWidth={1} />
            <span className="text-xs mt-2">Add City</span>
          </button>
        )}
      </div>
    </div>
  );
}
