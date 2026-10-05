"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export type SwipeDirection = "left" | "right";

interface SwipeCardProps {
  onSwipe: (dir: SwipeDirection) => void;
  children: React.ReactNode;
  /** Disables interaction, e.g. while a result is being shown. */
  disabled?: boolean;
}

const SWIPE_THRESHOLD_PX = 90;
const MAX_ROTATION_DEG = 18;

/**
 * A draggable card. Drag past the threshold horizontally to trigger onSwipe.
 * Uses pointer events so it works for both mouse and touch with one code path.
 */
export function SwipeCard({ onSwipe, children, disabled = false }: SwipeCardProps) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      startXRef.current = e.clientX;
      pointerIdRef.current = e.pointerId;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [disabled]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging || disabled) return;
      setDragX(e.clientX - startXRef.current);
    },
    [dragging, disabled]
  );

  const endDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging || disabled) return;
      setDragging(false);
      if (pointerIdRef.current !== null && e.currentTarget.hasPointerCapture(pointerIdRef.current)) {
        e.currentTarget.releasePointerCapture(pointerIdRef.current);
      }

      if (dragX > SWIPE_THRESHOLD_PX) {
        onSwipe("right");
      } else if (dragX < -SWIPE_THRESHOLD_PX) {
        onSwipe("left");
      }
      setDragX(0);
    },
    [dragging, disabled, dragX, onSwipe]
  );

  const rotation = Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, dragX / 10));

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`touch-pan-y select-none ${
        disabled
          ? "cursor-default"
          : dragging
            ? "cursor-grabbing"
            : "cursor-grab"
      } ${dragging ? "transition-none" : "transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"}`}
      /* Dynamic drag offset: the only remaining inline style (live px value). */
      style={{ transform: `translateX(${dragX}px) rotate(${rotation}deg)` }}
    >
      {children}
    </div>
  );
}
