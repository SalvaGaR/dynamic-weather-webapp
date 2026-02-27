"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/forecast", label: "Forecast" },
  { href: "/radar", label: "Radar" },
  { href: "/cities", label: "Cities" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-900">
          <MapPin size={18} strokeWidth={1.5} />
          <span className="font-semibold text-sm tracking-tight">Weather</span>
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors relative py-1 ${
                  isActive
                    ? "text-gray-900 font-medium"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-gray-900" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
