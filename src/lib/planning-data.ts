export interface PlanningStep {
  time: string;
  icon: string;
  title: string;
  desc: string;
  minutesSinceMidnight: number;
}

export const PLANNING: PlanningStep[] = [
  { time: "12h30", icon: "🍷", title: "L'Apéritif Royal", desc: "Que le festin commence ! Bienvenue en ces lieux enchantés.", minutesSinceMidnight: 12 * 60 + 30 },
  { time: "15h00", icon: "🍖", title: "Le Grand Banquet", desc: "Que les convives prennent place à la table du royaume.", minutesSinceMidnight: 15 * 60 },
  { time: "17h00", icon: "⚔️", title: "Les Joutes & Mini-Jeux", desc: "Que les plus vaillants chevaliers montrent leur valeur !", minutesSinceMidnight: 17 * 60 },
  { time: "18h00", icon: "🥛", title: "Le Trou Normand", desc: "Une pause enchantée pour reprendre des forces.", minutesSinceMidnight: 18 * 60 },
  { time: "19h00", icon: "☕", title: "La Potion du Sage", desc: "Le café des sages et des bardes du royaume.", minutesSinceMidnight: 19 * 60 },
  { time: "20h00", icon: "🎂", title: "Le Festin Sucré", desc: "Les pâtisseries du royaume clôturent ce jour béni.", minutesSinceMidnight: 20 * 60 },
];

/** Returns the index of the currently active step, or -1 if none has started yet. */
export function getCurrentStepIndex(): number {
  const now = new Date();
  const t = now.getHours() * 60 + now.getMinutes();
  let active = -1;
  for (let i = 0; i < PLANNING.length; i++) {
    if (t >= PLANNING[i].minutesSinceMidnight) active = i;
  }
  return active;
}
