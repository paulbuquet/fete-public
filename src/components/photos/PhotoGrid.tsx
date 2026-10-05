"use client";

import { Photo } from "@/lib/photos";
import { Card } from "@/components/ui/Card";

interface PhotoGridProps {
  photos: Photo[];
  loading?: boolean;
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  // loading is kept in props for compatibility but not used for rendering
  // to avoid flash of skeleton placeholders
  return (
    <div className="grid grid-cols-2 gap-2 px-3.5 pb-6">
      {photos.map((photo) => (
        <Card key={photo.id} className="aspect-square overflow-hidden p-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Supabase storage URLs */}
          <img
            src={photo.image_path}
            alt="Photo souvenir"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Card>
      ))}
    </div>
  );
}