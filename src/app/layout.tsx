import type { Metadata } from "next";
import { Cinzel, Crimson_Text } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fête",
  description: "Le programme de notre fête médiévale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cinzel.variable} ${crimsonText.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-night font-[Georgia,serif] text-parchment">{children}</body>
    </html>
  );
}
