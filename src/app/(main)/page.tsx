"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";

export default function HomePage() {
  return (
    <div className="px-3.5 pb-6">
      <SectionHeader icon="⚜️" title="Fête" subtitle="" />
      <p className="text-center font-crimson-text text-lg leading-relaxed text-parchment max-w-xs mx-auto mt-6">
        Merci d&apos;être venu à la fête, les jeux ouvriront plus tard, vous pouvez commencer la chasse dès maintenant ou accéder à l&apos;album photos
      </p>
    </div>
  );
}