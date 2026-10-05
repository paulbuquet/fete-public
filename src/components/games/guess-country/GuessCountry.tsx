"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { GameFinishedCard } from "@/components/ui/GameFinishedCard";
import { ScoreSubmissionNotice } from "@/components/ui/ScoreSubmissionNotice";
import { Button } from "@/components/ui/Button";
import { useCountdown } from "@/lib/useCountdown";
import { useScoreSubmission } from "@/lib/useScoreSubmission";
import { getGameMeta } from "@/lib/game-meta";
import { GuessCountryMCQ } from "./GuessCountryMCQ";
import {
  COUNTRIES,
  ROUNDS,
  TOTAL_ROUNDS,
  TIME_LIMIT_SECONDS,
  MAX_POSSIBLE_SCORE,
} from "./data";

const GAME_ID = "guess-country";
const SCORE_MULTIPLIER = getGameMeta(GAME_ID)?.scoreMultiplier ?? 1;

type AnswerState = "idle" | "validating" | "correct" | "wrong" | "timeout";
type GamePhase = "playing" | "showing-result" | "finished";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getOptionsForRound(correctCountry: string): string[] {
  const distractors = COUNTRIES.filter((c) => c !== correctCountry);
  const shuffledDistractors = shuffleArray([...distractors]);
  const selectedDistractors = shuffledDistractors.slice(0, 3);
  return shuffleArray([correctCountry, ...selectedDistractors]);
}

function calculateBonus(timeElapsed: number): number {
  if (timeElapsed <= 15) return 0.75;
  if (timeElapsed <= 30) return 0.5;
  if (timeElapsed <= 45) return 0.25;
  return 0;
}

export function GuessCountry({ playerName }: { playerName: string }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [finalScore, setFinalScore] = useState(0);
  const [endTitle, setEndTitle] = useState("");
  const [capturedElapsed, setCapturedElapsed] = useState(0);
  const [roundResetKey, setRoundResetKey] = useState(0);
  const { state: submitState, submit } = useScoreSubmission(GAME_ID, playerName);

  const currentRound = ROUNDS[roundIndex] ?? null;
  const isFinished = ROUNDS.length > 0 && roundIndex >= ROUNDS.length;

  const timeElapsedRef = useRef(0);

  const handleTimeExpired = useCallback(() => {
    if (phase !== "playing") return;
    timeElapsedRef.current = TIME_LIMIT_SECONDS;
    setCapturedElapsed(TIME_LIMIT_SECONDS);
    setAnswerState("timeout");
    setPhase("showing-result");
  }, [phase]);

  const remainingSeconds = useCountdown(TIME_LIMIT_SECONDS, phase === "playing", handleTimeExpired, roundResetKey);
  const isLowTime = remainingSeconds <= 10;
  const timeElapsed = phase === "playing" ? TIME_LIMIT_SECONDS - remainingSeconds : capturedElapsed;

  const handleAnswerSelect = useCallback(
    (country: string) => {
      if (phase !== "playing" || answerState !== "idle") return;
      setSelectedOption(country);
    },
    [phase, answerState]
  );

  const handleValidate = useCallback(() => {
    if (!currentRound || phase !== "playing" || answerState !== "idle" || !selectedOption) return;

    const isCorrect = selectedOption === currentRound.countryName;
    const elapsed = timeElapsed;
    setCapturedElapsed(elapsed);
    const bonus = isCorrect ? calculateBonus(elapsed) : 0;
    const roundScore = isCorrect ? 1 + bonus : 0;

    setAnswerState(isCorrect ? "correct" : "wrong");
    setPhase("showing-result");

    if (isCorrect) {
      setScore((prev) => prev + roundScore);
    }
  }, [currentRound, phase, answerState, selectedOption, timeElapsed]);

  const handleNext = useCallback(() => {
    if (phase !== "showing-result") return;

    const nextIndex = roundIndex + 1;
if (nextIndex >= ROUNDS.length) {
        const finalScoreRounded = Math.round(score * 100) / 100;
        setFinalScore(finalScoreRounded);
        setEndTitle("Partie terminée !");
        setPhase("finished");
        void submit(
          Math.round(finalScoreRounded * SCORE_MULTIPLIER),
          Math.round(MAX_POSSIBLE_SCORE * SCORE_MULTIPLIER)
        );
      } else {
      setRoundIndex(nextIndex);
      setSelectedOption(null);
      setAnswerState("idle");
      setPhase("playing");
      timeElapsedRef.current = 0;
      setRoundResetKey((k) => k + 1);
    }
  }, [roundIndex, phase, score, submit]);

  const handleRestart = useCallback(() => {
    setRoundIndex(0);
    setScore(0);
    setSelectedOption(null);
    setAnswerState("idle");
    setPhase("playing");
    setFinalScore(0);
    setEndTitle("");
    setCapturedElapsed(0);
    timeElapsedRef.current = 0;
    setRoundResetKey((k) => k + 1);
  }, []);

  const options = useMemo(
    () => getOptionsForRound(currentRound?.countryName ?? ""),
    [currentRound?.countryName]
  );

  if (isFinished || phase === "finished") {
    return (
      <GameFinishedCard icon="🌍" title={endTitle || "Partie terminée !"}>
        <p className="mb-4 font-crimson-text text-base text-muted">
          Score final : {finalScore.toFixed(2)} / {MAX_POSSIBLE_SCORE}
        </p>
        <ScoreSubmissionNotice state={submitState} />
        <Button onClick={handleRestart} className="mt-3">
          ↺ Rejouer pour s&apos;amuser
        </Button>
        <p className="mt-2 font-crimson-text text-[11px] text-muted italic">
          (seul le premier résultat compte pour le tournoi)
        </p>
      </GameFinishedCard>
    );
  }

  if (!currentRound) {
    return (
      <div className="px-3.5 pb-6 text-center">
        <p className="font-crimson-text text-muted italic">Aucune photo disponible.</p>
      </div>
    );
  }

  const isCorrectAnswer = answerState === "correct";
  const isWrongAnswer = answerState === "wrong";
  const isTimeout = answerState === "timeout";
  const showResult = phase === "showing-result";
  const bonus = isCorrectAnswer ? calculateBonus(timeElapsed) : 0;

  return (
    <div className="px-3.5 pb-6">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="font-cinzel text-[11px] tracking-[1px] text-muted">
          Photo {roundIndex + 1} / {TOTAL_ROUNDS}
        </span>
        <span className="rounded-xl border border-gold-dim bg-[rgb(201_168_76/0.12)] px-3 py-[3px] font-cinzel text-[13px] text-gold">
          🏆 {score.toFixed(2)} / {MAX_POSSIBLE_SCORE}
        </span>
      </div>

      <div className="mb-3 flex justify-center">
        <span
          className={`rounded-full border px-[18px] py-[5px] font-cinzel text-[15px] font-bold ${
            isLowTime
              ? "border-danger-strong bg-danger-bg text-danger"
              : "border-gold-dim bg-[rgb(201_168_76/0.12)] text-gold"
          }`}
        >
          ⏱ {formatTime(remainingSeconds)}
        </span>
      </div>

      <div className="mb-4 relative w-[80vw] mx-auto aspect-[4/3] overflow-hidden rounded-lg border border-gold-dim bg-[rgb(10_5_25/0.5)]">
        <Image
          src={currentRound.imageUrl}
          alt={`Photo à localiser - Round ${roundIndex + 1}`}
          fill
          sizes="60vw"
          className="object-cover"
        />
        {showResult && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgb(0_0_0/0.5)]">
            <div className="text-center p-4">
              <span className="text-[48px] drop-shadow-[0_2px_8px_rgb(0_0_0/0.8)]">
                {isCorrectAnswer ? "✅" : isWrongAnswer ? "❌" : "⏰"}
              </span>
              <p className="mt-2 font-cinzel text-lg text-parchment">
                {isTimeout ? "Temps écoulé !" : isCorrectAnswer ? "Bonne réponse !" : "Mauvaise réponse"}
              </p>
              <p className="mt-1 font-crimson-text text-base text-gold">
                Pays correct : <span className="font-bold">{currentRound.countryName}</span>
              </p>
              {isCorrectAnswer && bonus > 0 && (
                <p className="mt-1 font-cinzel text-sm text-success">+{bonus.toFixed(2)} bonus vitesse !</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <GuessCountryMCQ
          options={options}
          onAnswerSelect={handleAnswerSelect}
          selectedOption={selectedOption}
          disabled={phase !== "playing"}
        />
      </div>

      <div className="mb-4 flex items-center justify-center gap-3">
        {phase === "playing" && (
          <>
            <Button
              onClick={handleValidate}
              disabled={!selectedOption}
              className="px-4 py-2"
            >
              Valider
            </Button>
          </>
        )}

        {showResult && (
          <Button onClick={handleNext} className="px-6 py-2">
            {roundIndex + 1 >= TOTAL_ROUNDS ? "Voir les résultats" : "Suivant"}
          </Button>
        )}
      </div>
    </div>
  );
}