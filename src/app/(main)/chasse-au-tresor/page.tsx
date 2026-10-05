import type { Metadata } from "next";
import { TreasureHunt } from "@/components/treasure-hunt/TreasureHunt";

export const metadata: Metadata = {
  title: "La Chasse au Trésor",
  description: "Résous l'énigme pour découvrir le mot mystère",
};

export default function ChasseAuTresorPage() {
  return <TreasureHunt />;
}
