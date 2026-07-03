export type BookDifficulty = "gentle" | "steady" | "moderate" | "challenging" | "rigorous";

export interface BookshelfBook {
  id: string;
  title: string;
  author: string;
  /** Year (or era) first published, e.g. "1908" or "c. 700 BC". */
  year: string;
  /** One-paragraph summary written for homeschool parents. */
  summary: string;
  /** Virtues and character traits the book cultivates. */
  characterTraits: string[];
  difficulty: BookDifficulty;
  /** School subjects the book naturally teaches or reinforces. */
  subjects: string[];
}

export interface BookshelfStage {
  /** URL-safe slug, e.g. "little-sailors". */
  id: string;
  /** Nautical crew name, e.g. "Little Sailors". */
  name: string;
  gradeLabel: string;
  ageLabel: string;
  /** Short description of the stage and how to use these books. */
  description: string;
  books: BookshelfBook[];
}
