"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TREASURE_PATH = "/chasse-au-tresor";

const NAV_ENTRIES = [
  { href: "/joutes", icon: "⚔️", label: "Joutes" },
  { href: TREASURE_PATH, icon: "🗺️", label: "Trésor" },
  { href: "/photos-souvenirs", icon: "📷", label: "Photos" },
  { href: "/classement", icon: "🏆", label: "Tournoi" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[480px] -translate-x-1/2 border-t border-gold-dim bg-[rgb(15_8_35/0.97)] backdrop-blur-[12px]">
      {NAV_ENTRIES.map(({ href, icon, label }) => {
        const active = pathname === href || (href !== "/joutes" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 border-t-2 py-[9px] transition-all duration-200 ${
              active ? "border-t-gold" : "border-t-transparent"
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span
              className={`font-cinzel text-[9px] tracking-[1px] uppercase ${
                active ? "text-gold" : "text-[#7b6090]"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
