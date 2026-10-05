"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NameEntry } from "@/components/layout/NameEntry";
import { loadGames } from "./registry";
import type { GameDefinition } from "@/types/game";
import { GAMES_META } from "@/lib/game-meta";

interface GamesHubProps {
  playerName: string | null;
  onSetPlayerName: (name: string) => void;
}

export function GamesHub({ playerName, onSetPlayerName }: GamesHubProps) {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [pendingGameId, setPendingGameId] = useState<string | null>(null);
  const [games, setGames] = useState<GameDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadGames()
      .then((loadedGames) => {
        if (!cancelled) {
          setGames(loadedGames);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="px-3.5 pb-6">
        <SectionHeader icon="⚔️" title="Les Joutes" subtitle="Choisissez votre défi, brave chevalier" />
        <div className="flex flex-col gap-3">
          {GAMES_META.map((game) => (
            <button
              key={game.id}
              disabled
              className="flex w-full items-center gap-3.5 rounded-lg border border-[rgb(100_80_150/0.2)] bg-[rgb(20_12_40/0.3)] p-4 text-left opacity-50 animate-pulse cursor-not-allowed"
            >
              <span className="text-[30px]">{game.icon}</span>
              <div>
                <div className="mb-[3px] font-cinzel text-sm font-bold text-parchment">
                  {game.title}
                </div>
                <div className="font-crimson-text text-[13px] text-muted italic">
                  {game.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (pendingGameId && !playerName) {
    return (
      <NameEntry
        variant="inline"
        onSubmit={(name) => {
          onSetPlayerName(name);
          setActiveGameId(pendingGameId);
          setPendingGameId(null);
        }}
      />
    );
  }

  const activeGame = games.find((g) => g.id === activeGameId) ?? null;

  if (activeGame?.component) {
    const GameComponent = activeGame.component;
    return (
      <div>
        <button
          onClick={() => setActiveGameId(null)}
          className="mx-3.5 mt-3 cursor-pointer rounded-md border border-gold-dim bg-transparent px-3.5 py-[7px] font-cinzel text-[11px] text-gold"
        >
          ← Retour aux Joutes
        </button>
        <GameComponent playerName={playerName!} />
      </div>
    );
  }

  return (
    <div className="px-3.5 pb-6">
      <SectionHeader icon="⚔️" title="Les Joutes" subtitle="Choisissez votre défi, brave chevalier" />
      <div className="flex flex-col gap-3">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => {
              if (!game.available) return;
              if (playerName) {
                setActiveGameId(game.id);
              } else {
                setPendingGameId(game.id);
              }
            }}
            disabled={!game.available}
            className={`flex w-full items-center gap-3.5 rounded-lg border p-4 text-left ${
              game.available
                ? "cursor-pointer border-gold-dim bg-card"
                : "cursor-not-allowed border-[rgb(100_80_150/0.2)] bg-[rgb(20_12_40/0.3)] opacity-50"
            }`}
          >
            <span className="text-[30px]">{game.icon}</span>
            <div>
              <div className="mb-[3px] font-cinzel text-sm font-bold text-parchment">
                {game.title}
              </div>
              <div className="font-crimson-text text-[13px] text-muted italic">
                {game.desc}
              </div>
            </div>
            {game.available && <span className="ml-auto text-xl text-gold">›</span>}
          </button>
        ))}
      </div>
    </div>
  );
}