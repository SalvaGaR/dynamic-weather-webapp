"use client";

import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Moon,
  CloudMoon,
} from "lucide-react";
import { getWeatherInfo } from "@/services/weather";

interface WeatherIconProps {
  code: number;
  size?: number;
  isDay?: boolean;
  className?: string;
}

export default function WeatherIcon({
  code,
  size = 24,
  isDay = true,
  className = "",
}: WeatherIconProps) {
  const { icon } = getWeatherInfo(code);

  const props = { size, className, strokeWidth: 1.5 };

  if (!isDay && (icon === "sun" || code <= 1)) {
    return <Moon {...props} />;
  }

  if (!isDay && icon === "cloud-sun") {
    return <CloudMoon {...props} />;
  }

  switch (icon) {
    case "sun":
      return <Sun {...props} />;
    case "cloud-sun":
      return <CloudSun {...props} />;
    case "cloud":
      return <Cloud {...props} />;
    case "cloud-rain":
      return <CloudRain {...props} />;
    case "cloud-snow":
      return <CloudSnow {...props} />;
    case "cloud-drizzle":
      return <CloudDrizzle {...props} />;
    case "cloud-lightning":
      return <CloudLightning {...props} />;
    case "cloud-fog":
      return <CloudFog {...props} />;
    default:
      return <Cloud {...props} />;
  }
}
