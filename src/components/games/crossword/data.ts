export type Direction = "H" | "V";

export interface WordEntry {
  number: number;
  word: string;
  row: number;
  col: number;
  dir: Direction;
  clue: string;
}

export const GRID_ROWS = 22;
export const GRID_COLS = 21;

export const WORDS_DATA: WordEntry[] = [
  { number: 1, word: "TEST", row: 0, col: 14, dir: "V", clue: "ENTER YOUR OWN WORDS ?" }
];

export interface GridCell {
  letter: string;
  number: number | null;
}

export type SolutionGrid = (GridCell | null)[][];

export interface CellDivider {
  direction: 'horizontal' | 'vertical';
  position: number;
  style?: 'dotted' | 'dashed' | 'solid';
  color?: string;
}

export function buildSolutionGrid(): SolutionGrid {
  const grid: SolutionGrid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));

  for (const { word, row, col, dir, number } of WORDS_DATA) {
    for (let i = 0; i < word.length; i++) {
      const r = dir === "V" ? row + i : row;
      const c = dir === "H" ? col + i : col;
      if (!grid[r][c]) {
        grid[r][c] = { letter: word[i], number: i === 0 ? number : null };
      } else if (i === 0) {
        grid[r][c] = { letter: word[i], number };
      }
    }
  }
  return grid;
}

export const SOLUTION_GRID = buildSolutionGrid();

export const CELL_DIVIDERS: Record<string, CellDivider> = {
  "15-7": { direction: 'vertical', position: 100, style: 'dashed' },
  "12-8": { direction: 'vertical', position: 100, style: 'dashed' }
};

export function getWordsAtCell(row: number, col: number): WordEntry[] {
  return WORDS_DATA.filter((w) => {
    if (w.dir === "H") return w.row === row && col >= w.col && col < w.col + w.word.length;
    return w.col === col && row >= w.row && row < w.row + w.word.length;
  });
}

export function isCellInWord(word: WordEntry, row: number, col: number): boolean {
  if (word.dir === "H") return word.row === row && col >= word.col && col < word.col + word.word.length;
  return word.col === col && row >= word.row && row < word.row + word.word.length;
}

export function createEmptyUserGrid(): string[][] {
  return Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(""));
}

export function isGridComplete(userGrid: string[][]): boolean {
  for (const w of WORDS_DATA) {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.dir === "V" ? w.row + i : w.row;
      const c = w.dir === "H" ? w.col + i : w.col;
      if (userGrid[r][c] !== w.word[i]) return false;
    }
  }
  return true;
}

/** Counts how many whole words are fully and correctly filled in. 1 point per word. */
export function countCorrectWords(userGrid: string[][]): number {
  let count = 0;
  for (const w of WORDS_DATA) {
    let allCorrect = true;
    for (let i = 0; i < w.word.length; i++) {
      const r = w.dir === "V" ? w.row + i : w.row;
      const c = w.dir === "H" ? w.col + i : w.col;
      if (userGrid[r][c] !== w.word[i]) {
        allCorrect = false;
        break;
      }
    }
    if (allCorrect) count += 1;
  }
  return count;
}
