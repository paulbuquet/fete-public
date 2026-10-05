import type { WordEntry } from "./data";

interface ClueListProps {
  title: string;
  words: WordEntry[];
  activeWord: WordEntry | null;
  onClueClick: (word: WordEntry) => void;
}

export function ClueList({ title, words, activeWord, onClueClick }: ClueListProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 font-cinzel text-xs tracking-[2px] text-gold">{title}</p>
      {words.map((w) => {
        const isActive = activeWord !== null && activeWord.number === w.number && activeWord.dir === w.dir;
        return (
          <div
            key={`${w.dir}-${w.number}`}
            onClick={() => onClueClick(w)}
            className={`mb-1 flex cursor-pointer gap-2 rounded-md border px-2.5 py-1.5 transition-all duration-150 ${
              isActive ? "border-gold bg-[rgb(201_168_76/0.12)]" : "border-gold-dim bg-card"
            }`}
          >
            <span className="min-w-[18px] shrink-0 font-cinzel text-xs text-gold">
              {w.number}.
            </span>
            <span className="font-crimson-text text-sm leading-[1.3] text-parchment">
              {w.clue}
            </span>
          </div>
        );
      })}
    </div>
  );
}
