type Position = "tl" | "tr" | "bl" | "br";

interface CornerOrnamentProps {
  pos: Position;
}

export function CornerOrnament({ pos }: CornerOrnamentProps) {
  const positionClass =
    pos === "tl"
      ? "top-0 left-0"
      : pos === "tr"
        ? "top-0 right-0"
        : pos === "bl"
          ? "bottom-0 left-0"
          : "bottom-0 right-0";

  const flip =
    pos === "tr" || pos === "br" ? "scaleX(-1)" : pos === "bl" ? "scaleY(-1)" : "none";
  const flipCombined = pos === "br" ? "scale(-1,-1)" : flip;

  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute opacity-55 ${positionClass}`}
    >
      <g transform={flipCombined}>
        <path d="M5,5 L5,40 Q5,5 40,5 Z" className="fill-gold" opacity="0.7" />
        <path d="M5,5 L30,5 M5,5 L5,30" className="stroke-gold" strokeWidth="2.5" fill="none" />
        <circle cx="5" cy="5" r="4" className="fill-gold" />
        <path d="M15,5 Q20,14 5,20" className="stroke-gold" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="5" r="2" className="fill-royal" />
        <circle cx="5" cy="20" r="2" className="fill-royal" />
      </g>
    </svg>
  );
}
