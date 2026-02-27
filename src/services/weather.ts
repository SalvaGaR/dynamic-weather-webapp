export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  uvIndex: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mainly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Foggy", icon: "cloud-fog" },
  48: { label: "Rime fog", icon: "cloud-fog" },
  51: { label: "Light drizzle", icon: "cloud-drizzle" },
  53: { label: "Moderate drizzle", icon: "cloud-drizzle" },
  55: { label: "Dense drizzle", icon: "cloud-drizzle" },
  56: { label: "Freezing drizzle", icon: "cloud-drizzle" },
  57: { label: "Dense freezing drizzle", icon: "cloud-drizzle" },
  61: { label: "Slight rain", icon: "cloud-rain" },
  63: { label: "Moderate rain", icon: "cloud-rain" },
  65: { label: "Heavy rain", icon: "cloud-rain" },
  66: { label: "Freezing rain", icon: "cloud-rain" },
  67: { label: "Heavy freezing rain", icon: "cloud-rain" },
  71: { label: "Slight snow", icon: "cloud-snow" },
  73: { label: "Moderate snow", icon: "cloud-snow" },
  75: { label: "Heavy snow", icon: "cloud-snow" },
  77: { label: "Snow grains", icon: "cloud-snow" },
  80: { label: "Slight showers", icon: "cloud-rain" },
  81: { label: "Moderate showers", icon: "cloud-rain" },
  82: { label: "Violent showers", icon: "cloud-rain" },
  85: { label: "Slight snow showers", icon: "cloud-snow" },
  86: { label: "Heavy snow showers", icon: "cloud-snow" },
  95: { label: "Thunderstorm", icon: "cloud-lightning" },
  96: { label: "Thunderstorm with hail", icon: "cloud-lightning" },
  99: { label: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
};

export function getWeatherInfo(code: number): { label: string; icon: string } {
  return WMO_CODES[code] || { label: "Unknown", icon: "cloud" };
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  cityName: string,
  country: string
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day",
      "uv_index",
    ].join(","),
    hourly: [
      "temperature_2m",
      "weather_code",
      "precipitation_probability",
      "is_day",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
    uvIndex: Math.round(data.current.uv_index ?? 0),
    isDay: data.current.is_day === 1,
  };

  const now = new Date();
  const currentHourIndex = data.hourly.time.findIndex(
    (t: string) => new Date(t) >= now
  );
  const startIndex = Math.max(0, currentHourIndex);

  const hourly: HourlyForecast[] = data.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((time: string, i: number) => ({
      time,
      temperature: Math.round(data.hourly.temperature_2m[startIndex + i]),
      weatherCode: data.hourly.weather_code[startIndex + i],
      precipitationProbability:
        data.hourly.precipitation_probability[startIndex + i],
      isDay: data.hourly.is_day[startIndex + i] === 1,
    }));

  const daily: DailyForecast[] = data.daily.time.map(
    (date: string, i: number) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      precipitationProbability: data.daily.precipitation_probability_max[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
    })
  );

  return {
    current,
    hourly,
    daily,
    location: {
      name: cityName,
      country,
      latitude,
      longitude,
    },
  };
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (query.length < 2) return [];

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=8&language=en&format=json`
  );

  if (!response.ok) return [];

  const data = await response.json();

  if (!data.results) return [];

  return data.results.map(
    (r: { name: string; country: string; latitude: number; longitude: number; admin1?: string }) => ({
      name: r.name,
      country: r.country,
      latitude: r.latitude,
      longitude: r.longitude,
      admin1: r.admin1,
    })
  );
}
