"use client";

import { useEffect, useState } from "react";
import { PLANNING, getCurrentStepIndex } from "@/lib/planning-data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Planning() {
  // null = not yet mounted (server render). Avoids any SSR/client mismatch
  // since Date() differs between server and browser; the real value is
  // read only after mount, via the effect's interval tick below.
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setActiveStep(getCurrentStepIndex());
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  const resolvedStep = activeStep ?? -1;

  return (
    <div className="px-3.5 pb-6">
      <SectionHeader icon="📜" title="Parchemin du Jour" subtitle="Le déroulé de notre festin" />
      <div className="relative">
        <div className="absolute top-2 bottom-2 left-[27px] w-0.5 bg-[linear-gradient(to_bottom,#c9a84c,#7b2d8b,#c9a84c)] opacity-35" />
        {PLANNING.map((step, i) => {
          const isPast = resolvedStep > i;
          const isCurrent = resolvedStep === i;
          return (
            <div
              key={step.time}
              className={`mb-3.5 flex gap-3.5 transition-all duration-300 ${
                isCurrent ? "scale-[1.02]" : "scale-100"
              } ${isPast ? "opacity-50" : "opacity-100"}`}
            >
              <div
                className={`z-[1] flex size-[54px] shrink-0 items-center justify-center rounded-full border-2 text-[22px] ${
                  isCurrent
                    ? "border-flame bg-[linear-gradient(135deg,#c9a84c,#ff6b35)] shadow-[0_0_20px_rgb(255_107_53/0.5)]"
                    : "border-gold bg-[linear-gradient(135deg,#2d1b5e,#1a0e2e)]"
                }`}
              >
                {step.icon}
              </div>
              <div
                className={`flex-1 rounded-lg border px-3 py-[9px] ${
                  isCurrent
                    ? "border-flame bg-[linear-gradient(135deg,rgb(255_107_53/0.1),rgb(201_168_76/0.1))]"
                    : "border-gold-dim bg-card"
                }`}
              >
                <div className="mb-[3px] flex items-center justify-between">
                  <span className="font-cinzel text-[13px] font-bold text-parchment">
                    {step.title}
                  </span>
                  <span className="rounded-full bg-[rgb(201_168_76/0.1)] px-[7px] py-0.5 font-cinzel text-[11px] text-gold">
                    {step.time}
                  </span>
                </div>
                <p className="m-0 font-crimson-text text-[13px] text-muted italic">
                  {step.desc}
                </p>
                {isCurrent && (
                  <span className="mt-[5px] inline-block rounded-[10px] bg-flame px-[7px] py-0.5 font-cinzel text-[9px] tracking-[1px] text-white">
                    ✦ EN COURS
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
