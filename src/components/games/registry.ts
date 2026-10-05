import type { GameDefinition } from "@/types/game";
import { GAMES_META } from "@/lib/game-meta";
import { Crossword } from "./crossword/Crossword";
import { WhoseSong } from "./whose-song/WhoseSong";
import { GuessCountry } from "./guess-country/GuessCountry";
import { fetchAllGames } from "@/lib/games";

const COMPONENTS: Record<string, GameDefinition["component"]> = {
  crossword: Crossword,
  "whose-song": WhoseSong,
  "guess-country": GuessCountry,
};

export async function loadGames(): Promise<GameDefinition[]> {
  const rows = await fetchAllGames();
  const enabledMap = new Map(rows.map((r) => [r.name, r.enabled]));

  return GAMES_META.map((meta) => ({
    ...meta,
    available: enabledMap.get(meta.id) ?? false,
    component: COMPONENTS[meta.id] ?? null,
  }));
}