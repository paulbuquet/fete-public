"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GameFinishedCard } from "@/components/ui/GameFinishedCard";
import { ScoreSubmissionNotice } from "@/components/ui/ScoreSubmissionNotice";
import { Button } from "@/components/ui/Button";
import { SwipeCard, type SwipeDirection } from "./SwipeCard";
import { SONGS, PLAYER_PHOTOS, PLAYER_NAMES } from "./data";
import { AudioPlayer } from "./AudioPlayer";
import { useScoreSubmission } from "@/lib/useScoreSubmission";

type AnswerState = "idle" | "correct" | "wrong";

const GAME_ID = "whose-song";

const SIDE_TO_OWNER: Record<SwipeDirection, "player2" | "player1"> = {
  left: "player2",
  right: "player1",
};

interface WhoseSongProps {
  playerName: string;
}

export function WhoseSong({ playerName }: WhoseSongProps) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const { state: submitState, submit } = useScoreSubmission(GAME_ID, playerName);
  // Tracks the pending post-answer feedback timeout so it can be cancelled
  // if the component unmounts before it fires.
  const feedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current !== null) window.clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const currentSong = SONGS[index] ?? null;
  const isFinished = SONGS.length > 0 && index >= SONGS.length;

  const handleSwipe = useCallback(
    (dir: SwipeDirection) => {
      if (!currentSong || answerState !== "idle") return;

      const guessedOwner = SIDE_TO_OWNER[dir];
      const isCorrect = guessedOwner === currentSong.owner;
      const nextScore = isCorrect ? score + 1 : score;
      const nextAnswered = answered + 1;

      setAnswerState(isCorrect ? "correct" : "wrong");
      setAnswered(nextAnswered);
      if (isCorrect) setScore(nextScore);

      feedbackTimeoutRef.current = window.setTimeout(() => {
        setAnswerState("idle");
        const nextIndex = index + 1;
        setIndex(nextIndex);
        if (nextIndex >= SONGS.length) {
          void submit(nextScore, SONGS.length);
        }
      }, 1200);
    },
    [currentSong, answerState, score, answered, index, submit]
  );

  const handleRestart = useCallback(() => {
    setIndex(0);
    setScore(0);
    setAnswered(0);
    setAnswerState("idle");
  }, []);


  if (isFinished) {
    return (
      <GameFinishedCard icon="🎼" title="Partie terminée !">
        <p className="mb-4 font-crimson-text text-base text-muted">
          Score final : {score} / {SONGS.length}
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

  return (
    <div className="px-3.5 pb-6">

      <div className="mb-3.5 flex items-center justify-between">
        <span className="font-cinzel text-[11px] tracking-[1px] text-muted">
          Chanson {index + 1} / {SONGS.length}
        </span>
        <span className="rounded-xl border border-gold-dim bg-[rgb(201_168_76/0.12)] px-3 py-[3px] font-cinzel text-[13px] text-gold">
          🏆 {score} / {answered}
        </span>
      </div>

      {currentSong && (
        <AudioPlayer key={currentSong.id} audioSrc={currentSong.audioSrc} locked={answerState !== "idle"} 
          startTime={currentSong.startTime}
          clipDuration={currentSong.clipDuration}
        />
      )}

      <div className="relative mb-4">
        <div className="mb-2 flex justify-between px-1">
          <PlayerLabel owner="player2" highlight={answerState === "wrong" && currentSong?.owner === "player2"} correct={answerState === "correct" && currentSong?.owner === "player2"} />
          <PlayerLabel owner="player1" highlight={answerState === "wrong" && currentSong?.owner === "player1"} correct={answerState === "correct" && currentSong?.owner === "player1"} />
        </div>

        <SwipeCard onSwipe={handleSwipe} disabled={answerState !== "idle"}>
          <div
            className={`flex aspect-[3/4] w-[85vw] overflow-hidden rounded-[10px] border-2 transition-colors duration-200 ${
              answerState === "correct"
                ? "border-success-strong"
                : answerState === "wrong"
                  ? "border-danger-strong"
                  : "border-gold-dim"
            }`}
          >
            <PhotoSide owner="player2" />
            <PhotoSide owner="player1" />
          </div>
        </SwipeCard>

        {answerState !== "idle" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[52px] drop-shadow-[0_2px_8px_rgb(0_0_0/0.6)]">
              {answerState === "correct" ? "✅" : "❌"}
            </span>
          </div>
        )}
      </div>

      <p className="text-center font-crimson-text text-[13px] text-muted italic">
        Glissez la carte vers la photo de la bonne personne
      </p>
    </div>
  );
}

function PlayerLabel({ owner, highlight, correct }: { owner: "player2" | "player1"; highlight: boolean; correct: boolean }) {
  return (
    <span
      className={`font-cinzel text-[13px] font-bold transition-colors duration-200 ${
        correct ? "text-success-strong" : highlight ? "text-danger-strong" : "text-parchment"
      }`}
    >
      {PLAYER_NAMES[owner]}
    </span>
  );
}

function PhotoSide({ owner }: { owner: "player2" | "player1" }) {
  return (
    <div className="relative flex-1">
      <Image src={PLAYER_PHOTOS[owner]} alt={PLAYER_NAMES[owner]} fill sizes="(max-width: 480px) 50vw, 240px" className="object-cover" />
    </div>
  );
}
