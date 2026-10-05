"use client";

import { usePlayerName } from "@/lib/usePlayerName";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { playerName } = usePlayerName();

  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-[radial-gradient(ellipse_at_50%_0%,#2d1b5e_0%,#1a0e2e_50%)]">
      <Header playerName={playerName} />

      <div className="flex-1 overflow-y-auto pb-18">{children}</div>

      <BottomNav />
    </div>
  );
}
