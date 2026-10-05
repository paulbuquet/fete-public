"use client";

import { useCallback, useRef, useState } from "react";
import { GameFinishedCard } from "@/components/ui/GameFinishedCard";
import { ScoreSubmissionNotice } from "@/components/ui/ScoreSubmissionNotice";
import { useCountdown } from "@/lib/useCountdown";
import { ClueList } from "./ClueList";
import { useScoreSubmission } from "@/lib/useScoreSubmission";
import { useIsMobile } from "@/lib/useIsMobile";
import {
  GRID_ROWS,
  GRID_COLS,
  SOLUTION_GRID,
  WORDS_DATA,
  CELL_DIVIDERS,
  createEmptyUserGrid,
  getWordsAtCell,
  isCellInWord,
  isGridComplete,
  countCorrectWords,
  type WordEntry,
  type Direction,
} from "./data";

const GAME_ID = "crossword";
const TIME_LIMIT_SECONDS = 10 * 60;

interface Selected {
  row: number;
  col: number;
}

interface CrosswordProps {
  playerName: string;
}

type GamePhase = "playing" | "finished";

function sanitizeLetter(raw: string): string | null {
  const letter = raw.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return /^[A-Z0-9]$/.test(letter) ? letter : null;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function cellBackgroundClass(isSelected: boolean, isActive: boolean) {
  if (isSelected) return "bg-gold";
  if (isActive) return "bg-[rgb(201_168_76/0.18)]";
  return "bg-[rgb(30_16_64/0.9)]";
}

function cellBorderClass(isSelected: boolean, isActive: boolean) {
  if (isSelected) return "border-gold";
  if (isActive) return "border-[rgb(201_168_76/0.4)]";
  return "border-[rgb(201_168_76/0.15)]";
}

function cellTextClass(isSelected: boolean) {
  if (isSelected) return "text-night";
  return "text-parchment";
}

export function Crossword({ playerName }: CrosswordProps) {
  const [userGrid, setUserGrid] = useState<string[][]>(createEmptyUserGrid);
  // Mirror of userGrid, kept in sync by writeGrid. Lets time-expiry read the
  // latest grid without side effects inside state updaters (which React may
  // invoke twice in StrictMode).
  const userGridRef = useRef(userGrid);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [activeWord, setActiveWord] = useState<WordEntry | null>(null);
  const [preferredDir, setPreferredDir] = useState<Direction>("H");
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [finalScore, setFinalScore] = useState(0);
  const [endTitle, setEndTitle] = useState("");
  const { state: submitState, submit } = useScoreSubmission(GAME_ID, playerName);

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);
  const isMobile = useIsMobile();
  const [overlayPosition, setOverlayPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const writeGrid = useCallback((next: string[][]) => {
    userGridRef.current = next;
    setUserGrid(next);
  }, []);

  // Ends the game exactly once, records however many words are correct at
  // that moment, and submits the score. Used when time runs out, when the
  // player completes the grid early, and when a reveal is confirmed.
  const finishGame = useCallback(
    (grid: string[][], title: string) => {
      const score = countCorrectWords(grid);
      setEndTitle(title);
      setFinalScore(score);
      setPhase("finished");
      void submit(score, WORDS_DATA.length);
    },
    [submit]
  );

  const handleTimeExpired = useCallback(() => {
    finishGame(userGridRef.current, "Temps écoulé !");
  }, [finishGame]);

  const updateOverlayPosition = useCallback((row: number, col: number) => {
    if (!isMobile) return;
    const cellKey = `${row}-${col}`;
    const cellEl = cellRefs.current.get(cellKey);
    const containerEl = gridContainerRef.current;
    if (!cellEl || !containerEl) return;

    const cellRect = cellEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    setOverlayPosition({
      top: cellRect.top - containerRect.top,
      left: cellRect.left - containerRect.left,
      width: cellRect.width,
      height: cellRect.height,
    });

    // Focus the overlay input after position is set
    requestAnimationFrame(() => {
      overlayInputRef.current?.focus({ preventScroll: true });
    });
  }, [isMobile]);

  const remainingSeconds = useCountdown(TIME_LIMIT_SECONDS, phase === "playing", handleTimeExpired);
  const isLowTime = remainingSeconds <= 60;

  const selectCell = useCallback(
    (row: number, col: number) => {
      if (phase !== "playing") return;
      const wordsHere = getWordsAtCell(row, col);
      if (wordsHere.length === 0) return;

      const isSameCell = selected && selected.row === row && selected.col === col;

      if (isSameCell && wordsHere.length > 1) {
        const newDir: Direction = preferredDir === "H" ? "V" : "H";
        const nextWord = wordsHere.find((w) => w.dir === newDir) ?? wordsHere[0];
        setPreferredDir(nextWord.dir);
        setActiveWord(nextWord);
        setSelected({ row: nextWord.row, col: nextWord.col });
        updateOverlayPosition(nextWord.row, nextWord.col);
        return;
      }

      const preferred = wordsHere.find((w) => w.dir === preferredDir) ?? wordsHere[0];
      setActiveWord(preferred);
      setPreferredDir(preferred.dir);
      setSelected({ row: preferred.row, col: preferred.col });
      updateOverlayPosition(preferred.row, preferred.col);
    },
    [selected, preferredDir, phase, updateOverlayPosition]
  );

  const moveSelection = useCallback(
    (row: number, col: number, dir: Direction) => {
      if (phase !== "playing") return;
      if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return;
      if (!SOLUTION_GRID[row][col]) return;
      setSelected({ row, col });
      setPreferredDir(dir);
      const wordsHere = getWordsAtCell(row, col);
      const preferred = wordsHere.find((w) => w.dir === dir) ?? wordsHere[0] ?? null;
      setActiveWord(preferred);
      updateOverlayPosition(row, col);
    },
    [phase, updateOverlayPosition]
  );

  const applyLetter = useCallback(
    (letter: string) => {
      if (!selected || phase !== "playing") return;
      const { row, col } = selected;

      const next = userGridRef.current.map((r) => [...r]);
      next[row][col] = letter;
      writeGrid(next);

      if (isGridComplete(next)) {
        finishGame(next, "Grille achevée !");
      }

      if (activeWord) {
        const nr = activeWord.dir === "V" ? row + 1 : row;
        const nc = activeWord.dir === "H" ? col + 1 : col;
        if (nr < GRID_ROWS && nc < GRID_COLS && SOLUTION_GRID[nr][nc]) {
          setSelected({ row: nr, col: nc });
          updateOverlayPosition(nr, nc);
        }
      }
    },
    [selected, activeWord, phase, finishGame, writeGrid, updateOverlayPosition]
  );

  const applyBackspace = useCallback(() => {
    if (!selected || phase !== "playing") return;
    const { row, col } = selected;

    const next = userGridRef.current.map((r) => [...r]);
    next[row][col] = "";
    writeGrid(next);

    if (activeWord) {
      const pr = activeWord.dir === "V" ? row - 1 : row;
      const pc = activeWord.dir === "H" ? col - 1 : col;
      if (pr >= 0 && pc >= 0 && SOLUTION_GRID[pr][pc]) {
        setSelected({ row: pr, col: pc });
        updateOverlayPosition(pr, pc);
      }
    }
  }, [selected, activeWord, phase, writeGrid, updateOverlayPosition]);

  const handleNativeInput = useCallback((value: string) => {
    if (!selected || phase !== "playing") return;
    const lastChar = value.slice(-1);
    const letter = sanitizeLetter(lastChar);
    if (letter) applyLetter(letter);
  }, [selected, phase, applyLetter]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selected || phase !== "playing") return;
      const { row, col } = selected;

      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        applyBackspace();
        return;
      }
      if (e.key === "ArrowRight") { e.preventDefault(); moveSelection(row, col + 1, "H"); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); moveSelection(row, col - 1, "H"); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); moveSelection(row + 1, col, "V"); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); moveSelection(row - 1, col, "V"); return; }

      if (e.key.length === 1) {
        const letter = sanitizeLetter(e.key);
        if (letter) {
          e.preventDefault();
          applyLetter(letter);
        }
      }
    },
    [selected, phase, applyBackspace, moveSelection, applyLetter]
  );

  const handleClueClick = useCallback(
    (word: WordEntry) => {
      if (phase !== "playing") return;
      setActiveWord(word);
      setPreferredDir(word.dir);
      setSelected({ row: word.row, col: word.col });
      updateOverlayPosition(word.row, word.col);
    },
    [phase, updateOverlayPosition]
  );

  const horizontalClues = WORDS_DATA.filter((w) => w.dir === "H").sort((a, b) => a.number - b.number);
  const verticalClues = WORDS_DATA.filter((w) => w.dir === "V").sort((a, b) => a.number - b.number);

  if (phase === "finished") {
    return (
      <GameFinishedCard icon="⏳" title={endTitle}>
        <p className="mb-2 font-crimson-text text-base text-muted">
          Score : {finalScore} / {WORDS_DATA.length} mots trouvés
        </p>
        <ScoreSubmissionNotice state={submitState} />
        <p className="mt-4 font-crimson-text text-sm text-muted italic">
          En attente de la prochaine joute…
        </p>
      </GameFinishedCard>
    );
  }

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} className="outline-none px-2.5 pb-6">

      <div className="mb-3 flex justify-center">
        <span
          className={`rounded-full border px-[18px] py-[5px] font-cinzel text-[15px] font-bold ${
            isLowTime
              ? "border-danger-strong bg-danger-bg text-danger"
              : "border-gold-dim bg-[rgb(201_168_76/0.12)] text-gold"
          }`}
        >
          ⏱ {formatTime(remainingSeconds)}
        </span>
      </div>

      <div
        className={`mb-3 min-h-[52px] rounded-lg border px-3.5 py-2.5 transition-all duration-200 ${
          activeWord
            ? "border-gold bg-[linear-gradient(135deg,rgb(201_168_76/0.12),rgb(45_27_94/0.5))]"
            : "border-gold-dim bg-card"
        }`}
      >
        {activeWord ? (
          <>
            <span className="font-cinzel text-[11px] tracking-[1px] text-gold">
              {activeWord.number} {activeWord.dir === "H" ? "→ HORIZONTAL" : "↓ VERTICAL"}
            </span>
            <p className="mt-[3px] font-crimson-text text-[15px] leading-[1.4] text-parchment">
              {activeWord.clue}
            </p>
          </>
        ) : (
          <p className="pt-1.5 text-center font-crimson-text text-sm text-muted italic">
            Touchez une case pour voir la définition
          </p>
        )}
      </div>

      <div className="mb-3 overflow-x-auto">
        <div
          ref={gridContainerRef}
          className="inline-block rounded border border-gold-dim bg-[rgb(10_5_25/0.5)] p-0.5 relative"
        >
          {Array.from({ length: GRID_ROWS }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: GRID_COLS }, (_, col) => {
                const cell = SOLUTION_GRID[row][col];
                if (!cell) {
                  return <div key={col} className="size-[26px] bg-transparent" />;
                }

                const userLetter = userGrid[row][col] || "";
                const isSelected = selected !== null && selected.row === row && selected.col === col;
                const isActive = activeWord !== null && isCellInWord(activeWord, row, col);
                const cellKey = `${row}-${col}`;
                const divider = CELL_DIVIDERS[cellKey];

                return (
                  <div
                    key={col}
                    ref={(el) => {
                      if (el) cellRefs.current.set(cellKey, el);
                      else cellRefs.current.delete(cellKey);
                    }}
                    onClick={() => selectCell(row, col)}
                    className={`relative flex size-[26px] cursor-pointer select-none items-center justify-center border-[0.5px] transition-colors duration-150 ${cellBackgroundClass(isSelected, isActive)} ${cellBorderClass(isSelected, isActive)}`}
                  >
                    {cell.number !== null && (
                      <span
                        className={`absolute top-px left-px font-cinzel text-[6px] leading-none ${
                          isSelected ? "text-night" : "text-gold"
                        }`}
                      >
                        {cell.number}
                      </span>
                    )}
                    <span
                      className={`font-cinzel text-[11px] font-bold ${cellTextClass(isSelected)}`}
                    >
                      {userLetter}
                    </span>
                    {divider && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          [divider.direction === 'horizontal' ? 'top' : 'left']: `${divider.position}%`,
                          transform: divider.direction === 'horizontal' ? 'translateY(-50%)' : 'translateX(-50%)',
                        }}
                      >
                        <div
                          className={
                            divider.direction === 'horizontal'
                              ? `border-t border-${divider.style || 'dotted'} w-full h-[1px]`
                              : `border-l border-${divider.style || 'dotted'} h-full w-[1px]`
                          }
                          style={{ borderColor: divider.color || 'hsl(43, 47%, 94%)' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {isMobile && overlayPosition && (
        <input
          ref={overlayInputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          style={{
            position: "absolute",
            top: overlayPosition.top,
            left: overlayPosition.left,
            width: overlayPosition.width,
            height: overlayPosition.height,
            opacity: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            padding: 0,
            margin: 0,
            fontSize: "16px", // Prevents zoom on iOS
            zIndex: 10,
          }}
          onCompositionStart={() => { isComposing.current = true; }}
          onCompositionEnd={(e) => {
            isComposing.current = false;
            handleNativeInput(e.currentTarget.value);
            e.currentTarget.value = "";
          }}
          onChange={(e) => {
            if (!isComposing.current) {
              handleNativeInput(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") { e.preventDefault(); applyBackspace(); }
            if (e.key === "Enter") { e.preventDefault(); overlayInputRef.current?.blur(); }
          }}
        />
      )}

      <ClueList title="→ Horizontaux" words={horizontalClues} activeWord={activeWord} onClueClick={handleClueClick} />
      <ClueList title="↓ Verticaux" words={verticalClues} activeWord={activeWord} onClueClick={handleClueClick} />
    </div>
  );
}
