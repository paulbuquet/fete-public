/**
 * Single source of truth for game metadata. Data-only (no React imports) so
 * both the games registry and the leaderboard can rely on it.
 *
 * To add a new game: add its metadata here, then wire its component and
 * availability in components/games/registry.ts.
 */
export interface GameMeta {
  id: string;
  icon: string;
  title: string;
  desc: string;
  scoreMultiplier?: number;
}

export const GAMES_META: GameMeta[] = [
  { id: "crossword", icon: "🔤", title: "L'Énigme du Scribe", desc: "Mots croisés personnalisés" },
  { id: "whose-song", icon: "🎵", title: "À Qui Est Cette Mélodie ?", desc: "Devinez qui écoute chaque chanson" },
  { id: "guess-country", icon: "🌍", title: "Devine le Pays", desc: "Localise la photo sur la carte", scoreMultiplier: 100 },
];

/** Returns the metadata for a game id, or undefined if unknown. */
export function getGameMeta(gameId: string): GameMeta | undefined {
  return GAMES_META.find((g) => g.id === gameId);
}
