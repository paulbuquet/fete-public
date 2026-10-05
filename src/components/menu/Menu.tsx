import { SectionHeader } from "@/components/ui/SectionHeader";

export function Menu() {
  return (
    <div className="px-3.5 pb-6">
      <SectionHeader icon="🍽️" title="La Table du Festin" subtitle="Le menu du banquet royal" />
      <div className="rounded-lg border border-dashed border-gold-dim bg-card p-8 text-center">
        <div className="mb-2.5 text-[44px]">📜</div>
        <p className="mb-2 font-cinzel text-xs tracking-[2px] text-gold">
          PARCHEMIN EN COURS DE RÉDACTION
        </p>
        <p className="font-crimson-text text-[15px] text-muted italic">
          Les cuisiniers du château préparent encore la liste des mets raffinés. Revenez bientôt…
        </p>
      </div>
    </div>
  );
}
