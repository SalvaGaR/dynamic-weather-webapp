"use client";

import { WeatherProvider } from "@/context/WeatherContext";
import Navbar from "@/components/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WeatherProvider>
      <Navbar />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
    </WeatherProvider>
  );
}
