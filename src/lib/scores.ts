import { supabase } from "@/lib/supabase";

export interface ScoreRow {
  player_name: string;
  game_id: string;
  score: number;
  max_score: number;
}

export interface PerGameScore {
  gameId: string;
  score: number;
  maxScore: number;
}

export interface LeaderboardEntry {
  playerName: string;
  totalScore: number;
  totalMaxScore: number;
  gamesPlayed: number;
  /** Individual results, one per game the player has completed. */
  perGame: PerGameScore[];
}

/**
 * Submits a score for one game. Relies on the DB's unique(player_name, game_id)
 * constraint to enforce "one attempt counted per game": if a row already exists,
 * this insert is rejected rather than overwriting the first result.
 * Returns true if the score was recorded, false if an attempt already existed.
 */
export async function submitScore(row: ScoreRow): Promise<boolean> {
  const { error } = await supabase.from("scores").insert(row);

  if (error) {
    // Postgres unique_violation code — the player already has a score for this game.
    if (error.code === "23505") return false;
    throw error;
  }
  return true;
}

/**
 * Fetches all scores and aggregates them per player: total (sum across all
 * games) plus the individual per-game breakdown, sorted by total descending.
 */
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.from("scores").select("player_name, game_id, score, max_score");
  if (error) throw error;

  const byPlayer = new Map<string, LeaderboardEntry>();

  for (const row of data ?? []) {
    const existing = byPlayer.get(row.player_name);
    const gameResult: PerGameScore = { gameId: row.game_id, score: row.score, maxScore: row.max_score };

    if (existing) {
      existing.totalScore += row.score;
      existing.totalMaxScore += row.max_score;
      existing.gamesPlayed += 1;
      existing.perGame.push(gameResult);
    } else {
      byPlayer.set(row.player_name, {
        playerName: row.player_name,
        totalScore: row.score,
        totalMaxScore: row.max_score,
        gamesPlayed: 1,
        perGame: [gameResult],
      });
    }
  }

  return Array.from(byPlayer.values()).sort((a, b) => b.totalScore - a.totalScore);
}
