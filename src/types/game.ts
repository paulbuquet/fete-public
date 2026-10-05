import type { ComponentType } from "react";

export interface GameComponentProps {
  playerName: string;
}

export interface GameDefinition {
  id: string;
  icon: string;
  title: string;
  desc: string;
  available: boolean;
  /** null for games that don't exist yet (available: false placeholders). */
  component: ComponentType<GameComponentProps> | null;
}
