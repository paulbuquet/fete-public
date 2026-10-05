"use client";

interface GuessCountryMCQProps {
  options: string[];
  onAnswerSelect: (country: string) => void;
  selectedOption: string | null;
  disabled: boolean;
}

export function GuessCountryMCQ({
  options,
  onAnswerSelect,
  selectedOption,
  disabled,
}: GuessCountryMCQProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((country) => (
        <button
          key={country}
          onClick={() => !disabled && onAnswerSelect(country)}
          disabled={disabled}
          className={`px-4 py-3 rounded-lg border-2 text-lg font-cinzel transition ${
            selectedOption === country
              ? "border-gold bg-gold/20 text-gold"
              : "border-gold-dim bg-[rgb(30_16_64/0.5)] text-muted hover:border-gold hover:text-parchment"
          }`}
        >
          {country}
        </button>
      ))}
    </div>
  );
}
