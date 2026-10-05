interface HeaderProps {
  playerName: string | null;
}

export function Header({ playerName }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-center gap-2.5 border-b border-gold-dim bg-[rgb(26_14_46/0.95)] px-5 pt-2.5 pb-2 backdrop-blur-[8px]">
      <span className="text-base">⚜️</span>
      <div className="text-center">
        <div className="font-cinzel text-[15px] font-bold tracking-[1px] text-parchment">
          Fête
        </div>
        <div className="font-cinzel text-[9px] tracking-[2px] text-royal">
          {playerName ? `Bienvenue, ${playerName}` : ""}
        </div>
      </div>
      <span className="text-base">⚜️</span>
    </div>
  );
}
