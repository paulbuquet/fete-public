"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";

interface AudioPlayerProps {
  audioSrc: string;
  /** When true (e.g. an answer was just given), playback is force-paused and controls disabled. */
  locked: boolean;
  /** Start position in seconds. Defaults to 0. */
  startTime?: number;
  /** If set, playback auto-stops this many seconds after startTime. */
  clipDuration?: number;
}

/**
 * Renders playback controls for a single song. Designed to be mounted with a
 * `key` tied to the song id, so switching songs remounts this component and
 * naturally resets playback state — no cross-song state synchronization needed.
 *
 * isPlaying is driven by the <audio> element's own onPlay/onPause events rather
 * than by manually setting state after calling .play()/.pause(), so it can never
 * drift from the real playback state.
 */
export function AudioPlayer({ audioSrc, locked, startTime = 0, clipDuration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || locked) return;

    if (audio.paused) {
      audio.currentTime = startTime;
      // If playback fails (autoplay policy, missing file), onPlay simply never
      // fires, so isPlaying correctly stays false — no catch-driven setState needed.
      void audio.play();
    } else {
      audio.pause();
    }
  }, [locked, startTime]);

  // Synchronizes the <audio> element (an external, imperative system) with the
  // `locked` prop coming from the parent: stop playback the moment an answer
  // is locked in. This is exactly the kind of external-system sync useEffect
  // exists for; the element's own onPause event (below) then updates isPlaying.
  useEffect(() => {
    if (locked) audioRef.current?.pause();
  }, [locked]);

  // Stops playback once the clip's end point (startTime + clipDuration) is reached.
  // Only wired up when clipDuration is provided; otherwise the track plays normally.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !clipDuration) return;

    const endTime = startTime + clipDuration;
    const handleTimeUpdate = () => {
      if (audio.currentTime >= endTime) {
        audio.pause();
        audio.currentTime = startTime;
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [startTime, clipDuration]);

  return (
    <Card className="mb-3 inline-flex w-full flex-col items-center px-3 py-2 text-center">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={handlePlayPause}
        disabled={locked}
        className={`size-12 rounded-full border-0 text-lg shadow-[0_2px_10px_rgb(201_168_76/0.3)] ${
          locked ? "cursor-default opacity-50" : "cursor-pointer"
        } ${
          isPlaying
            ? "bg-flame"
            : "bg-[linear-gradient(135deg,#c9a84c,#a07830)]"
        }`}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <p className="mt-1 font-crimson-text text-[11px] text-muted italic">
        {isPlaying ? "En écoute…" : "Touchez pour écouter"}
      </p>
    </Card>
  );
}