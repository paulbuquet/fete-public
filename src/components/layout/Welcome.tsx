"use client";

import { useEffect, useState } from "react";
import { Divider } from "@/components/ui/Divider";
import { CornerOrnament } from "@/components/ui/CornerOrnament";
import { Button } from "@/components/ui/Button";

interface WelcomeProps {
  onEnter: () => void;
}

const STAR_COUNT = 28;

const STAR_ANIMATIONS = [
  "animate-[twinkle_2s_ease-in-out_infinite]",
  "animate-[twinkle_3s_ease-in-out_infinite]",
  "animate-[twinkle_4s_ease-in-out_infinite]",
];

export function Welcome({ onEnter }: WelcomeProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#2d1b5e_0%,#1a0e2e_60%,#0d0820_100%)] p-5 text-center">
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-gold ${
            i % 4 === 0 ? "size-[3px]" : "size-[2px]"
          } ${STAR_ANIMATIONS[i % 3]}`}
          style={{
            top: `${(i * 37) % 90}%`,
            left: `${(i * 53) % 100}%`,
            opacity: 0.3 + ((i * 7) % 10) / 20,
            animationDelay: `${(i % 5) * 0.6}s`,
          }}
        />
      ))}

      <div
        className={`relative w-full max-w-[370px] rounded-[10px] border-2 border-gold bg-[linear-gradient(160deg,#2a1a4e,#1e1040)] px-7 py-9 shadow-[0_0_60px_rgb(201_168_76/0.2),inset_0_0_30px_rgb(0_0_0/0.4)] transition-all duration-[850ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          ready ? "translate-y-0 scale-100 opacity-100" : "translate-y-7 scale-95 opacity-0"
        }`}
      >
        <CornerOrnament pos="tl" />
        <CornerOrnament pos="tr" />
        <CornerOrnament pos="bl" />
        <CornerOrnament pos="br" />

        <div className="mb-2 text-[52px] drop-shadow-[0_0_12px_#c9a84c]">⚜️</div>
        <p className="mb-2.5 font-cinzel text-[10px] tracking-[4px] text-gold uppercase">
          Le Royaume vous convie
        </p>
        <h1 className="mb-[5px] font-cinzel text-[28px] leading-[1.2] font-bold text-parchment [text-shadow:0_0_20px_rgb(201_168_76/0.5)]">
          
        </h1>
        <p className="mb-3.5 font-cinzel text-xs tracking-[2px] text-royal">
          Fête
        </p>
        <Divider />
        <p className="mt-3.5 mb-[22px] font-crimson-text text-base leading-[1.6] text-muted italic">
          &laquo; En ce jour béni des anciens, deux âmes unissent leur destin pour l&apos;éternité. &raquo;
        </p>
        <Button
          onClick={onEnter}
          className="rounded px-8 py-[13px] text-[13px] tracking-[2px] shadow-[0_4px_20px_rgb(201_168_76/0.4)]"
        >
          Entrer dans le Château
        </Button>
      </div>
    </div>
  );
}
