"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { WeatherData, fetchWeatherData } from "@/services/weather";

export interface SavedCity {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface WeatherContextType {
  activeCity: SavedCity;
  setActiveCity: (city: SavedCity) => void;
  savedCities: SavedCity[];
  addCity: (city: SavedCity) => void;
  removeCity: (cityName: string) => void;
  weatherData: WeatherData | null;
  cityWeatherMap: Record<string, WeatherData>;
  loading: boolean;
  error: string | null;
  refreshWeather: () => void;
}

const DEFAULT_CITIES: SavedCity[] = [
  { name: "New York", country: "United States", latitude: 40.7128, longitude: -74.006 },
  { name: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278 },
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
  { name: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708 },
];

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [savedCities, setSavedCities] = useState<SavedCity[]>(DEFAULT_CITIES);
  const [activeCity, setActiveCity] = useState<SavedCity>(DEFAULT_CITIES[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cityWeatherMap, setCityWeatherMap] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved cities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weatherapp_cities");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedCities(parsed);
          setActiveCity(parsed[0]);
        }
      } catch {
        // use defaults
      }
    }
  }, []);

  // Save cities to localStorage
  useEffect(() => {
    localStorage.setItem("weatherapp_cities", JSON.stringify(savedCities));
  }, [savedCities]);

  const loadWeatherForCity = useCallback(async (city: SavedCity) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(
        city.latitude,
        city.longitude,
        city.name,
        city.country
      );
      setWeatherData(data);
      setCityWeatherMap((prev) => ({ ...prev, [city.name]: data }));
    } catch {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load weather for active city
  useEffect(() => {
    loadWeatherForCity(activeCity);
  }, [activeCity, loadWeatherForCity]);

  // Load weather for all saved cities
  useEffect(() => {
    const loadAll = async () => {
      for (const city of savedCities) {
        if (!cityWeatherMap[city.name]) {
          try {
            const data = await fetchWeatherData(
              city.latitude,
              city.longitude,
              city.name,
              city.country
            );
            setCityWeatherMap((prev) => ({ ...prev, [city.name]: data }));
          } catch {
            // silently fail for background loads
          }
        }
      }
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedCities]);

  const addCity = useCallback(
    (city: SavedCity) => {
      if (!savedCities.find((c) => c.name === city.name)) {
        setSavedCities((prev) => [...prev, city]);
      }
    },
    [savedCities]
  );

  const removeCity = useCallback(
    (cityName: string) => {
      setSavedCities((prev) => prev.filter((c) => c.name !== cityName));
      if (activeCity.name === cityName) {
        const remaining = savedCities.filter((c) => c.name !== cityName);
        if (remaining.length > 0) {
          setActiveCity(remaining[0]);
        }
      }
    },
    [activeCity.name, savedCities]
  );

  const refreshWeather = useCallback(() => {
    loadWeatherForCity(activeCity);
  }, [activeCity, loadWeatherForCity]);

  return (
    <WeatherContext.Provider
      value={{
        activeCity,
        setActiveCity,
        savedCities,
        addCity,
        removeCity,
        weatherData,
        cityWeatherMap,
        loading,
        error,
        refreshWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
