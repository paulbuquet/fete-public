"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts down from `durationSeconds`, pausing (freezing the remaining time)
 * while `active` is false. Calls `onExpire` exactly once when it reaches zero.
 * Timekeeping is based on wall-clock timestamps rather than interval counts,
 * so a throttled background tab or timer drift can never distort the total.
 */
export function useCountdown(durationSeconds: number, active: boolean, onExpire: () => void, resetKey?: number) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const remainingRef = useRef(durationSeconds);
  const deadlineRef = useRef<number | null>(null);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  // Keeps the ref pointed at the latest onExpire without making it a
  // dependency of the timer effect below (which would restart the interval
  // on every render).
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!active) {
      deadlineRef.current = null;
      return;
    }

    deadlineRef.current = Date.now() + remainingRef.current * 1000;
    expiredRef.current = false;

    const tick = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const next = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      remainingRef.current = next;
      setRemaining(next);
      if (next === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
    };

    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [active, resetKey]);

  // Reset timer when resetKey changes
  useEffect(() => {
    if (resetKey === undefined) return;
    remainingRef.current = durationSeconds;
    deadlineRef.current = Date.now() + durationSeconds * 1000;
    expiredRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on key change
    setRemaining(durationSeconds);
  }, [resetKey, durationSeconds]);

  return remaining;
}
