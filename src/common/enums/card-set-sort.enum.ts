enum ECardSetSort {
  releaseDateAscending,
  releaseDateDescending,
  alphabeticallyAscending,
  alphabeticallyDescending
}

export type CardSetSort = keyof typeof ECardSetSort;

export const CardSetSortDisplayValue = new Map<CardSetSort, string>([
  ["releaseDateAscending", "Release date (ascending)"],
  ["releaseDateDescending", "Release date (descending)"],
  ["alphabeticallyAscending", "Alphabetically (ascending)"],
  ["alphabeticallyDescending", "Alphabetically (descending)"]
]);
