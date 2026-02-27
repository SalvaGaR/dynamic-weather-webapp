"use client";

import { useWeather } from "@/context/WeatherContext";
import WeatherIcon from "@/components/WeatherIcon";
import { getWeatherInfo } from "@/services/weather";
import { Wind, Droplets, Sun, Thermometer, Loader2 } from "lucide-react";

function formatHour(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function HomePage() {
  const { weatherData, loading, error } = useWeather();

  if (loading && !weatherData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <Loader2 className="animate-spin text-gray-300" size={32} />
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, hourly, location } = weatherData;
  const weatherInfo = getWeatherInfo(current.weatherCode);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Main temperature display */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <WeatherIcon
            code={current.weatherCode}
            size={64}
            isDay={current.isDay}
            className="text-gray-700"
          />
        </div>
        <div className="text-[120px] leading-none font-light text-gray-900 tracking-tighter">
          {current.temperature}°
        </div>
        <p className="text-gray-400 text-sm mt-2">{weatherInfo.label}</p>
        <h1 className="text-lg font-medium text-gray-900 mt-4">
          {location.name}
        </h1>
        <p className="text-gray-400 text-sm">{formatDate(new Date())}</p>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-center divide-x divide-gray-100 mb-12">
        <div className="flex flex-col items-center px-8">
          <Wind size={16} strokeWidth={1.5} className="text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-900">
            {current.windSpeed} km/h
          </span>
          <span className="text-xs text-gray-400 mt-0.5">Wind</span>
        </div>
        <div className="flex flex-col items-center px-8">
          <Droplets size={16} strokeWidth={1.5} className="text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-900">
            {current.humidity}%
          </span>
          <span className="text-xs text-gray-400 mt-0.5">Humidity</span>
        </div>
        <div className="flex flex-col items-center px-8">
          <Sun size={16} strokeWidth={1.5} className="text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-900">
            {current.uvIndex}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">UV Index</span>
        </div>
        <div className="flex flex-col items-center px-8">
          <Thermometer
            size={16}
            strokeWidth={1.5}
            className="text-gray-400 mb-2"
          />
          <span className="text-sm font-medium text-gray-900">
            {current.feelsLike}°
          </span>
          <span className="text-xs text-gray-400 mt-0.5">Feels like</span>
        </div>
      </div>

      {/* Hourly forecast */}
      <div>
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Hourly Forecast
        </h2>
        <div className="flex gap-0 overflow-x-auto pb-2 -mx-6 px-6">
          {hourly.slice(0, 12).map((hour, i) => (
            <div
              key={hour.time}
              className="flex flex-col items-center min-w-[72px] py-4"
            >
              <span className="text-xs text-gray-400 mb-3">
                {i === 0 ? "Now" : formatHour(hour.time)}
              </span>
              <WeatherIcon
                code={hour.weatherCode}
                size={20}
                isDay={hour.isDay}
                className="text-gray-500 mb-3"
              />
              <span className="text-sm font-medium text-gray-900">
                {hour.temperature}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
