"use client";

import { useCallback, useState } from "react";
import { submitScore } from "@/lib/scores";

export type SubmitState = "idle" | "submitting" | "submitted" | "already-played" | "error";

/**
 * Handles submitting a completed game's score exactly once. The actual
 * "one attempt" enforcement lives in the DB (unique constraint on
 * player_name + game_id) — this hook just calls it and reflects the result.
 */
export function useScoreSubmission(gameId: string, playerName: string | null) {
  const [state, setState] = useState<SubmitState>("idle");

  const submit = useCallback(
    async (score: number, maxScore: number) => {
      if (!playerName) return;
      setState("submitting");
      try {
        const recorded = await submitScore({
          player_name: playerName,
          game_id: gameId,
          score,
          max_score: maxScore,
        });
        setState(recorded ? "submitted" : "already-played");
      } catch {
        setState("error");
      }
    },
    [gameId, playerName]
  );

  return { state, submit };
}
