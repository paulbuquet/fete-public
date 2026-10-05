"use client";

import { useEffect, useState } from "react";
import { fetchPhotos, type Photo } from "@/lib/photos";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { CameraCapture } from "@/components/photos/CameraCapture";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function PhotosSouvenirsPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);

  const loadPhotos = async () => {
    try {
      const data = await fetchPhotos();
      setPhotos(data);
    } catch {
      // Silent fail - empty state will show
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data fetching pattern
    loadPhotos();
  }, []);

  const handleCameraOpen = () => {
    setShowCamera(true);
  };

  const handlePhotoUploaded = () => {
    setShowCamera(false);
    loadPhotos();
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  return (
    <div className="relative">
      <div className="px-3.5 pb-6">
        <SectionHeader icon="📷" title="Photos souvenirs" subtitle="Tous les moments capturés" />
        <PhotoGrid photos={photos} loading={loading} />
      </div>

      {showCamera && (
        <CameraCapture
          onSuccess={handlePhotoUploaded}
          onClose={handleCameraClose}
        />
      )}

      <button
        onClick={handleCameraOpen}
        className="fixed bottom-20 right-4 z-30 size-14 rounded-full border-2 border-gold bg-[linear-gradient(135deg,#c9a84c,#a07830)] flex items-center justify-center text-2xl font-bold text-night shadow-[0_4px_20px_rgb(201_168_76/0.4)] active:scale-95 transition-transform"
        aria-label="Prendre une photo"
      >
        +
      </button>
    </div>
  );
}