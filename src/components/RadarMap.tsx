"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RadarMapProps {
  latitude: number;
  longitude: number;
  activeLayer: string;
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

const OPENWEATHERMAP_LAYERS: Record<string, string> = {
  precipitation: "precipitation_new",
  clouds: "clouds_new",
  temperature: "temp_new",
  wind: "wind_new",
};

export default function RadarMap({
  latitude,
  longitude,
  activeLayer,
}: RadarMapProps) {
  const [rainviewerTimestamps, setRainviewerTimestamps] = useState<number[]>([]);
  const [rainviewerHost, setRainviewerHost] = useState("");

  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.radar?.past) {
          setRainviewerTimestamps(
            data.radar.past.map((item: { time: number }) => item.time)
          );
          setRainviewerHost(data.host || "https://tilecache.rainviewer.com");
        }
      })
      .catch(() => {
        // Silently fail - map still works without radar overlay
      });
  }, []);

  const latestTimestamp =
    rainviewerTimestamps.length > 0
      ? rainviewerTimestamps[rainviewerTimestamps.length - 1]
      : null;

  const owmLayer = OPENWEATHERMAP_LAYERS[activeLayer] || "precipitation_new";

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={7}
      className="h-full w-full"
      zoomControl={true}
      attributionControl={false}
    >
      {/* CartoDB Positron (no labels) for minimalist white base */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* Label overlay - very subtle */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        opacity={0.5}
      />

      {/* RainViewer radar layer for precipitation */}
      {activeLayer === "precipitation" && latestTimestamp && (
        <TileLayer
          url={`${rainviewerHost}/v2/radar/${latestTimestamp}/256/{z}/{x}/{y}/2/1_1.png`}
          opacity={0.4}
        />
      )}

      {/* OpenWeatherMap layers for other types (free tier has limited tiles) */}
      {activeLayer !== "precipitation" && (
        <TileLayer
          url={`https://tile.openweathermap.org/map/${owmLayer}/{z}/{x}/{y}.png?appid=demo`}
          opacity={0.4}
        />
      )}

      <MapUpdater lat={latitude} lng={longitude} />
    </MapContainer>
  );
}
