"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Cloud, CloudRain, Thermometer, Wind, Play, Pause } from "lucide-react";
import { useWeather } from "@/context/WeatherContext";

const RadarMap = dynamic(() => import("@/components/RadarMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-gray-300" size={32} />
    </div>
  ),
});

type LayerType = "precipitation" | "clouds" | "temperature" | "wind";

const layerOptions: { id: LayerType; label: string; icon: React.ReactNode }[] = [
  { id: "precipitation", label: "Precipitation", icon: <CloudRain size={14} strokeWidth={1.5} /> },
  { id: "clouds", label: "Clouds", icon: <Cloud size={14} strokeWidth={1.5} /> },
  { id: "temperature", label: "Temperature", icon: <Thermometer size={14} strokeWidth={1.5} /> },
  { id: "wind", label: "Wind", icon: <Wind size={14} strokeWidth={1.5} /> },
];

export default function RadarPage() {
  const { activeCity } = useWeather();
  const [activeLayer, setActiveLayer] = useState<LayerType>("precipitation");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative h-[calc(100vh-3.5rem)]">
      <RadarMap
        latitude={activeCity.latitude}
        longitude={activeCity.longitude}
        activeLayer={activeLayer}
      />

      {/* Bottom control panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {isPlaying ? (
              <Pause size={14} className="text-gray-700" />
            ) : (
              <Play size={14} className="text-gray-700 ml-0.5" />
            )}
          </button>

          <div className="h-6 w-px bg-gray-100" />

          <div className="flex items-center gap-1">
            {layerOptions.map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  activeLayer === layer.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {layer.icon}
                {layer.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
