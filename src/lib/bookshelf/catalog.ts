import type { BookDifficulty, BookshelfStage } from "@/types/bookshelf";
import { littleSailors } from "@/data/bookshelf/little-sailors";
import { youngDeckhands } from "@/data/bookshelf/young-deckhands";
import { midshipmen } from "@/data/bookshelf/midshipmen";
import { firstMates } from "@/data/bookshelf/first-mates";
import { navigators } from "@/data/bookshelf/navigators";
import { shipsCaptains } from "@/data/bookshelf/ships-captains";

/** All stages in reading order, youngest to oldest. */
export const bookshelfStages: BookshelfStage[] = [
  littleSailors,
  youngDeckhands,
  midshipmen,
  firstMates,
  navigators,
  shipsCaptains,
];

export function getStageById(id: string): BookshelfStage | undefined {
  return bookshelfStages.find((stage) => stage.id === id);
}

export function getTotalBookCount(): number {
  return bookshelfStages.reduce((sum, stage) => sum + stage.books.length, 0);
}

export const difficultyLabels: Record<BookDifficulty, string> = {
  gentle: "Gentle Waters",
  steady: "Steady Breeze",
  moderate: "Open Sea",
  challenging: "Strong Currents",
  rigorous: "Deep Waters",
};

export const difficultyStyles: Record<BookDifficulty, string> = {
  gentle: "bg-emerald-100 text-emerald-800",
  steady: "bg-sky-100 text-sky-800",
  moderate: "bg-indigo-100 text-indigo-800",
  challenging: "bg-amber-100 text-amber-800",
  rigorous: "bg-rose-100 text-rose-800",
};

/** Books shown to free members as a taste of each stage. */
export const FREE_PREVIEW_COUNT = 3;
