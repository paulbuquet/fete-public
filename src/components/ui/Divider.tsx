export function Divider() {
  return (
    <div className="my-2.5 flex items-center gap-2">
      <div className="h-px flex-1 bg-[linear-gradient(to_right,transparent,#c9a84c)]" />
      <span className="text-[13px] text-gold">✦</span>
      <div className="h-px flex-1 bg-[linear-gradient(to_left,transparent,#c9a84c)]" />
    </div>
  );
}
