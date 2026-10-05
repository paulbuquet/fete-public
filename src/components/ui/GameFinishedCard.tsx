interface GameFinishedCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

/** Shared wrapper for the end-of-game screen of every mini-game. */
export function GameFinishedCard({ icon, title, children }: GameFinishedCardProps) {
  return (
    <div className="px-3.5 pb-6">
      <div className="rounded-[10px] border border-gold bg-[linear-gradient(135deg,rgb(201_168_76/0.2),rgb(123_45_139/0.2))] p-6 text-center">
        <div className="text-[44px]">{icon}</div>
        <p className="mt-2 mb-1 font-cinzel text-[17px] font-bold text-gold">{title}</p>
        {children}
      </div>
    </div>
  );
}
