import { supabase } from "@/lib/supabase";

export interface Photo {
  id: string;
  image_path: string;
  created_at: string;
}

const BUCKET = "photos";
const MAX_DIMENSION = 1200;
const QUALITY = 0.8;

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > height) {
        if (width > MAX_DIMENSION) {
          height = (height * MAX_DIMENSION) / width;
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width = (width * MAX_DIMENSION) / height;
          height = MAX_DIMENSION;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/webp",
        QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function fetchPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("id, image_path, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function uploadPhoto(file: File): Promise<string> {
  console.log("[uploadPhoto] Starting upload for:", file.name, file.type, file.size);
  
  let blob: Blob;
  try {
    blob = await compressImage(file);
    console.log("[uploadPhoto] Compressed to:", blob.size, "bytes, type:", blob.type);
  } catch (err) {
    console.error("[uploadPhoto] Compression failed:", err);
    throw err;
  }
  
  const path = `${Date.now()}-${randomSuffix()}.webp`;
  console.log("[uploadPhoto] Storage path:", path);

  const { error: uploadError, data: uploadData } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/webp",
    upsert: false,
  });
  if (uploadError) {
    console.error("[uploadPhoto] Storage upload failed:", uploadError);
    throw uploadError;
  }
  console.log("[uploadPhoto] Storage upload success:", uploadData);

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = publicUrlData.publicUrl;
  console.log("[uploadPhoto] Public URL:", publicUrl);

  const { error: dbError, data: dbData } = await supabase.from("photos").insert({
    image_path: publicUrl,
  });
  if (dbError) {
    console.error("[uploadPhoto] DB insert failed:", dbError);
    throw dbError;
  }
  console.log("[uploadPhoto] DB insert success:", dbData);

  return publicUrl;
}