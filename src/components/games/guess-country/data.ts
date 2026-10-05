export interface Round {
  id: number;
  imageUrl: string;
  countryName: string;
}

export const COUNTRIES = [
  "Allemagne",
  "France",
  "Lituanie",
  "Pays-Bas",
  "Estonie",
  "Pologne",
] as const;

export const ROUNDS: Round[] = [
  { id: 1, imageUrl: "/guess-country/photos/round1.jpg", countryName: "Allemagne" },
  { id: 2, imageUrl: "/guess-country/photos/round2.jpg", countryName: "France" },
  { id: 3, imageUrl: "/guess-country/photos/round3.jpg", countryName: "France" },
  { id: 4, imageUrl: "/guess-country/photos/round4.jpg", countryName: "Lituanie" },
  { id: 5, imageUrl: "/guess-country/photos/round5.jpg", countryName: "Lituanie" },
  { id: 6, imageUrl: "/guess-country/photos/round6.jpg", countryName: "Pays-Bas" },
  { id: 7, imageUrl: "/guess-country/photos/round7.jpg", countryName: "France" },
  { id: 8, imageUrl: "/guess-country/photos/round8.jpg", countryName: "Estonie" },
  { id: 9, imageUrl: "/guess-country/photos/round9.jpg", countryName: "France" },
  { id: 10, imageUrl: "/guess-country/photos/round10.jpg", countryName: "Allemagne" },
  { id: 11, imageUrl: "/guess-country/photos/round11.jpg", countryName: "Pologne" },
];

export const TOTAL_ROUNDS = ROUNDS.length;
export const TIME_LIMIT_SECONDS = 60;
export const MAX_BONUS = 0.75;
export const MAX_POSSIBLE_SCORE = TOTAL_ROUNDS * (1 + MAX_BONUS);