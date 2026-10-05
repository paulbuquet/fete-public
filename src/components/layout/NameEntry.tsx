"use client";

import { useState } from "react";
import { Divider } from "@/components/ui/Divider";
import { CornerOrnament } from "@/components/ui/CornerOrnament";
import { Button } from "@/components/ui/Button";

interface NameEntryProps {
  onSubmit: (name: string) => void;
  /** "fullscreen" (default) covers the viewport; "inline" fits within a tab's content area. */
  variant?: "fullscreen" | "inline";
}

export function NameEntry({ onSubmit, variant = "fullscreen" }: NameEntryProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    onSubmit(trimmed);
  };

  const containerClass =
    variant === "fullscreen"
      ? "min-h-dvh bg-[radial-gradient(ellipse_at_50%_30%,#2d1b5e_0%,#1a0e2e_60%,#0d0820_100%)] p-5"
      : "py-6 px-3.5";

  return (
    <div className={`flex flex-col items-center text-center ${containerClass}`}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[340px] rounded-[10px] border-2 border-gold bg-[linear-gradient(160deg,#2a1a4e,#1e1040)] px-[26px] py-8 shadow-[0_0_60px_rgb(201_168_76/0.2),inset_0_0_30px_rgb(0_0_0/0.4)]"
      >
        <CornerOrnament pos="tl" />
        <CornerOrnament pos="tr" />
        <CornerOrnament pos="bl" />
        <CornerOrnament pos="br" />

        <div className="mb-2 text-[40px]">🛡️</div>
        <p className="mb-2 font-cinzel text-[10px] tracking-[3px] text-gold uppercase">
          Avant de jouter
        </p>
        <h1 className="mb-3.5 font-cinzel text-xl font-bold text-parchment">
          Quel est le nom de votre équipe ?
        </h1>
        <Divider />

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={40}
          autoFocus
          className="mt-3 mb-[18px] w-full rounded-md border border-gold-dim bg-[rgb(10_5_25/0.6)] px-3.5 py-3 font-crimson-text text-base text-parchment text-center outline-none"
        />

        <Button
          type="submit"
          disabled={value.trim().length < 2}
          className="w-full rounded py-[13px] text-[13px] tracking-[2px]"
        >
          Confirmer
        </Button>

        <p className="mt-3 font-crimson-text text-xs text-muted italic">
          Ce nom apparaîtra dans le classement des joutes
        </p>
      </form>
    </div>
  );
}
