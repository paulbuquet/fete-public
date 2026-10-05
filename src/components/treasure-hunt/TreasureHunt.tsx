"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GameFinishedCard } from "@/components/ui/GameFinishedCard";
import { NEXT_CLUE, RIDDLES, SUCCESS_MESSAGE, SUCCESS_TITLE, isCorrectAnswer } from "./data";

type AttemptState = "idle" | "wrong" | "correct";

export function TreasureHunt() {
  const [value, setValue] = useState("");
  const [attempt, setAttempt] = useState<AttemptState>("idle");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = isCorrectAnswer(value);
    if (result.correct) {
      setAttempt("correct");
      setRedirectUrl(result.redirectUrl ?? null);
    } else {
      setAttempt("wrong");
    }
  };

  if (attempt === "correct") {
    return (
      <GameFinishedCard icon="🎉" title={SUCCESS_TITLE}>
        <p className="mb-3 font-crimson-text text-base text-parchment">{SUCCESS_MESSAGE}</p>
        <a
          href={redirectUrl ?? NEXT_CLUE}
          target="_blank"
          rel="noopener noreferrer"
          className="font-crimson-text text-[15px] leading-[1.4] text-gold italic underline hover:text-gold/80"
        >
          {redirectUrl ?? NEXT_CLUE}
        </a>
      </GameFinishedCard>
    );
  }

  return (
    <div className="px-3.5 pb-6">
      <SectionHeader
        icon="🗺️"
        title="La Chasse au Trésor"
        subtitle="Assemble chaque indice pour découvrir le mot mystère"
      />

      <Card className="mb-4 p-4">
        <ul className="flex flex-col gap-2.5">
          {RIDDLES.map((riddle) => (
            <li key={riddle} className="font-crimson-text text-[15px] leading-[1.35] text-parchment">
              {riddle}
            </li>
          ))}
        </ul>
      </Card>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (attempt === "wrong") setAttempt("idle");
          }}
          placeholder="Le mot mystère…"
          maxLength={40}
          aria-label="Réponse de l'énigme"
          className={`w-full rounded-md border bg-[rgb(10_5_25/0.6)] px-3.5 py-3 text-center font-crimson-text text-base text-parchment outline-none ${
            attempt === "wrong" ? "border-danger-strong" : "border-gold-dim"
          }`}
        />
        <Button type="submit" disabled={!value.trim()} className="w-full rounded py-[13px] text-[13px] tracking-[2px]">
          Valider
        </Button>
      </form>

      <p
        className={`mt-3 h-5 text-center font-crimson-text text-sm ${
          attempt === "wrong" ? "text-danger-strong" : "invisible"
        }`}
      >
        Ce n&apos;est pas le bon mot… Réessaie, brave chevalier !
      </p>
    </div>
  );
}
