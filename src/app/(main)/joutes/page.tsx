"use client";

import { usePlayerName } from "@/lib/usePlayerName";
import { GamesHub } from "@/components/games/GamesHub";

export default function JoutesPage() {
  const { playerName, setPlayerName } = usePlayerName();

  return <GamesHub playerName={playerName} onSetPlayerName={setPlayerName} />;
}