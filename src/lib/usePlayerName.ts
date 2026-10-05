"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "pacs-fete:player-name";

// Module-level subscribers so every hook instance stays in sync with
// localStorage writes.
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

/**
 * Server render (and the hydration pass) always sees null so markup matches;
 * React then re-renders with the stored value right after mounting.
 */
function getServerSnapshot(): string | null {
  return null;
}

/**
 * Manages the current player's display name, persisted in localStorage so
 * guests don't have to re-enter it on every visit to the app.
 */
export function usePlayerName() {
  const playerName = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const setPlayerName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    window.localStorage.setItem(STORAGE_KEY, trimmed);
    listeners.forEach((notify) => notify());
  }, []);

  const clearPlayerName = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    listeners.forEach((notify) => notify());
  }, []);

  return { playerName, setPlayerName, clearPlayerName };
}
