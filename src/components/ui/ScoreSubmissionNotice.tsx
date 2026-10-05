import type { SubmitState } from "@/lib/useScoreSubmission";

interface ScoreSubmissionNoticeProps {
  state: SubmitState;
}

/** Reflects the outcome of a score submission, shared by every game's end screen. */
export function ScoreSubmissionNotice({ state }: ScoreSubmissionNoticeProps) {
  const base = "mt-2 font-crimson-text text-xs italic";

  if (state === "submitting") return <p className={`${base} text-muted`}>Envoi au grand registre…</p>;
  if (state === "submitted") return <p className={`${base} text-success`}>✓ Score enregistré au tournoi !</p>;
  if (state === "already-played") return <p className={`${base} text-muted`}>Ce défi a déjà été comptabilisé pour vous.</p>;
  if (state === "error") return <p className={`${base} text-danger`}>Impossible de contacter le registre. Vérifiez votre connexion.</p>;
  return null;
}
