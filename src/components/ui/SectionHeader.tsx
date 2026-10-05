import { Divider } from "./Divider";

interface SectionHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
}

export function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="pt-[18px] pb-3 text-center">
      <div className="mb-1.5 text-[34px] drop-shadow-[0_0_8px_rgb(201_168_76/0.5)]">{icon}</div>
      <h2 className="mb-[3px] font-cinzel text-[21px] font-bold text-parchment [text-shadow:0_0_15px_rgb(201_168_76/0.3)]">
        {title}
      </h2>
      <p className="font-crimson-text text-sm text-muted italic">{subtitle}</p>
      <Divider />
    </div>
  );
}
