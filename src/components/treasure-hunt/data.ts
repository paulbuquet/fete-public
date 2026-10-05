export const RIDDLES: string[] = [
  "Mon premier se trouve dans la terre mais jamais dans la mer",
  "Mon deuxième et mon troisième sont nommés D par les anglophones",
  "Mon quatrième est la première du nom de l'hérisson",
  "Mon 5ème est 4 places avant mon 4ème",
  "Mon 6ème s'inspire",
];

const ANSWER = "TRESOR";

export const SUCCESS_TITLE = "Félicitations !";
export const SUCCESS_MESSAGE = "Continue la chasse avec ce lien :";
export const NEXT_CLUE = "https://youtube.com/shorts/tkcruciA6mU";
export const WHAT3WORDS_CLUE = "https://youtu.be/QgysXkdkR7Q";

export function isCorrectAnswer(guess: string): { correct: boolean; redirectUrl?: string } {
  const normalized = guess
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();

  if (normalized === ANSWER) {
    return { correct: true, redirectUrl: NEXT_CLUE };
  }

  const what3wordsNormalized = guess.toLowerCase();
  if (what3wordsNormalized === "what3words") {
    return { correct: true, redirectUrl: WHAT3WORDS_CLUE };
  }

  return { correct: false };
}
