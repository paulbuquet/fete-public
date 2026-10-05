"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/scores";
import { getGameMeta } from "@/lib/game-meta";

type LoadState = "loading" | "ready" | "error";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [reloadToken, setReloadToken] = useState(0);

  // Fetches the leaderboard whenever reloadToken changes (initial mount, or
  // a manual "Actualiser" click). The effect only kicks off the async work;
  // `state` starts as "loading" already, so there's no synchronous setState
  // in the effect body itself — only the async .then/.catch callbacks below
  // update state, which is the intended use of an effect.
  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard()
      .then((data) => {
        if (cancelled) return;
        setEntries(data);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const reload = useCallback(() => {
    setState("loading");
    setReloadToken((t) => t + 1);
  }, []);

  return (
    <div className="px-3.5 pb-6">
      <SectionHeader icon="🏆" title="Le Grand Tournoi" subtitle="Classement de tous les chevaliers" />

      {state === "loading" && (
        <p className="text-center font-crimson-text text-muted italic">
          Consultation du grand registre…
        </p>
      )}

      {state === "error" && (
        <Card className="p-5 text-center">
          <p className="mb-3 font-crimson-text text-muted italic">
            Le registre est introuvable pour l&apos;instant.
          </p>
          <button
            onClick={reload}
            className="cursor-pointer rounded-md border border-gold bg-[rgb(201_168_76/0.15)] px-[18px] py-2 font-cinzel text-xs text-gold"
          >
            ↺ Réessayer
          </button>
        </Card>
      )}

      {state === "ready" && entries.length === 0 && (
        <p className="text-center font-crimson-text text-muted italic">
          Aucun chevalier n&apos;a encore relevé de défi. Soyez le premier !
        </p>
      )}

      {state === "ready" && entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((entry, i) => (
            <LeaderboardRow key={entry.playerName} entry={entry} rank={i} />
          ))}
        </div>
      )}

      <button
        onClick={reload}
        className="mx-auto mt-4 block cursor-pointer rounded-md border border-gold-dim bg-transparent px-4 py-2 font-cinzel text-[11px] text-muted"
      >
        ↺ Actualiser
      </button>
    </div>
  );
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
}

function LeaderboardRow({ entry, rank }: LeaderboardRowProps) {
  const [expanded, setExpanded] = useState(false);

  const displayTotalScore = entry.perGame.reduce((sum, game) => {
    const meta = getGameMeta(game.gameId);
    const multiplier = meta?.scoreMultiplier ?? 1;
    return sum + game.score / multiplier;
  }, 0);

  return (
    <div
      className={`overflow-hidden rounded-lg border ${
        rank === 0
          ? "border-gold bg-[linear-gradient(135deg,rgb(201_168_76/0.18),rgb(45_27_94/0.5))]"
          : "border-gold-dim bg-card"
      }`}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        <div className="flex items-center gap-3 px-3.5 py-2.5">
          <span className="min-w-7 text-xl text-center">{MEDALS[rank] ?? `${rank + 1}.`}</span>
          <div className="flex-1">
            <div className="font-cinzel text-sm font-bold text-parchment">
              {entry.playerName}
            </div>
            <div className="font-crimson-text text-xs text-muted italic">
              {entry.gamesPlayed} joute{entry.gamesPlayed > 1 ? "s" : ""} disputée{entry.gamesPlayed > 1 ? "s" : ""}
            </div>
          </div>
          <span className="font-cinzel text-base font-bold text-gold">
            {Number.isInteger(displayTotalScore) ? displayTotalScore : displayTotalScore.toFixed(2)}
          </span>
          <span
            className={`text-xs text-muted transition-transform duration-150 ${
              expanded ? "rotate-90" : ""
            }`}
          >
            ›
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gold-dim px-3.5 pt-2 pb-3">
          {entry.perGame.map((game) => {
            const meta = getGameMeta(game.gameId);
            const multiplier = meta?.scoreMultiplier ?? 1;
            const displayScore = game.score / multiplier;
            const displayMaxScore = game.maxScore / multiplier;
            return (
              <div key={game.gameId} className="flex items-center gap-2 py-1">
                <span className="text-sm">{meta?.icon ?? "🎲"}</span>
                <span className="flex-1 font-crimson-text text-[13px] text-muted">
                  {meta?.title ?? game.gameId}
                </span>
                <span className="font-cinzel text-xs text-parchment">
                  {Number.isInteger(displayScore) ? displayScore : displayScore.toFixed(2)} / {Number.isInteger(displayMaxScore) ? displayMaxScore : displayMaxScore.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
