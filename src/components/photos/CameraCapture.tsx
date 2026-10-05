"use client";

import { useState, useRef, useEffect } from "react";
import { uploadPhoto } from "@/lib/photos";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface CameraCaptureProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function CameraCapture({ onSuccess, onClose }: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("[CameraCapture] Mounting, triggering file input");
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("[CameraCapture] File selected:", file?.name, file?.type, file?.size);
    if (!file) {
      console.log("[CameraCapture] No file selected, closing");
      onClose();
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
    setError(null);
  };

  const handleRetake = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    console.log("[CameraCapture] Starting upload for:", selectedFile.name, selectedFile.type, selectedFile.size);
    setUploading(true);
    setError(null);

    try {
      await uploadPhoto(selectedFile);
      console.log("[CameraCapture] Upload completed successfully");
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setSelectedFile(null);
      onSuccess();
    } catch (err) {
      console.error("[CameraCapture] Upload failed:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      {preview && (
        <div className="relative w-full max-w-sm">
          <Card className="p-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview is a blob URL, not optimizable */}
            <img
              src={preview}
              alt="Preview"
              className="w-full aspect-square object-cover"
            />
            <div className="p-4 space-y-3">
              {error && (
                <p className="text-center text-red-400 text-sm font-crimson-text">{error}</p>
              )}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 bg-[rgb(100_80_150/0.3)] border border-gold-dim hover:bg-[rgb(100_80_150/0.5)]"
                >
                  Refaire
                </Button>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? "Envoi..." : "Envoyer"}
                </Button>
              </div>
            </div>
          </Card>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1.5 text-xl leading-none"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}