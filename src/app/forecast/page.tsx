"use client";

import { useWeather } from "@/context/WeatherContext";
import WeatherIcon from "@/components/WeatherIcon";
import { getWeatherInfo } from "@/services/weather";
import { Sunrise, Sunset, Loader2 } from "lucide-react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function formatHour(timeStr: string): string {
  return new Date(timeStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatSunTime(timeStr: string): string {
  return new Date(timeStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ForecastPage() {
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

  const { current, hourly, daily, location } = weatherData;
  const weatherInfo = getWeatherInfo(current.weatherCode);
  const todayData = daily[0];

  // Chart data from hourly
  const chartData = hourly.slice(0, 24).map((h) => ({
    time: formatHour(h.time),
    temp: h.temperature,
    precip: h.precipitationProbability,
  }));

  // Temp range across all days for the bar visualization
  const globalMin = Math.min(...daily.map((d) => d.tempMin));
  const globalMax = Math.max(...daily.map((d) => d.tempMax));
  const tempRange = globalMax - globalMin || 1;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left panel */}
      <div className="w-[30%] min-w-[280px] border-r border-gray-100 p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
            Current Weather
          </h2>
          <div className="mb-6">
            <WeatherIcon
              code={current.weatherCode}
              size={48}
              isDay={current.isDay}
              className="text-gray-700 mb-4"
            />
            <div className="text-6xl font-light text-gray-900 tracking-tighter">
              {current.temperature}°
            </div>
            <p className="text-sm text-gray-400 mt-1">{weatherInfo.label}</p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-gray-900">
              {location.name}
            </p>
            <p className="text-sm text-gray-400">{location.country}</p>
          </div>
        </div>

        {todayData && (
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Sunrise size={16} strokeWidth={1.5} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Sunrise</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatSunTime(todayData.sunrise)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sunset size={16} strokeWidth={1.5} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Sunset</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatSunTime(todayData.sunset)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Chart */}
        <div className="mb-10">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            24-Hour Overview
          </h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  interval={3}
                />
                <YAxis
                  yAxisId="temp"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  domain={["dataMin - 2", "dataMax + 2"]}
                  unit="°"
                />
                <YAxis
                  yAxisId="precip"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  unit="%"
                  hide
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #f3f4f6",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                  labelStyle={{ color: "#6b7280" }}
                />
                <Area
                  yAxisId="precip"
                  type="monotone"
                  dataKey="precip"
                  name="Precipitation"
                  fill="#e0f2fe"
                  stroke="#7dd3fc"
                  strokeWidth={1.5}
                  fillOpacity={0.3}
                  unit="%"
                />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={false}
                  unit="°"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-day forecast */}
        <div>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            7-Day Forecast
          </h2>
          <div className="space-y-0">
            {daily.map((day) => {
              const barLeft = ((day.tempMin - globalMin) / tempRange) * 100;
              const barWidth =
                ((day.tempMax - day.tempMin) / tempRange) * 100;

              return (
                <div
                  key={day.date}
                  className="flex items-center py-3 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-500 w-24 shrink-0">
                    {formatDay(day.date)}
                  </span>
                  <div className="w-8 shrink-0">
                    <WeatherIcon
                      code={day.weatherCode}
                      size={18}
                      className="text-gray-400"
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-10 text-right shrink-0">
                    {day.tempMin}°
                  </span>
                  <div className="flex-1 mx-3 h-1.5 bg-gray-50 rounded-full relative">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-gray-300 to-gray-900"
                      style={{
                        left: `${barLeft}%`,
                        width: `${Math.max(barWidth, 4)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-10 text-right shrink-0">
                    {day.tempMax}°
                  </span>
                  {day.precipitationProbability > 0 && (
                    <span className="text-xs text-sky-400 w-10 text-right shrink-0 ml-2">
                      {day.precipitationProbability}%
                    </span>
                  )}
                  {day.precipitationProbability === 0 && (
                    <span className="w-10 shrink-0 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
