enum ECardSetSort {
  releaseDateAscending,
  releaseDateDescending,
  alphabeticallyAscending,
  alphabeticallyDescending
}

export type CardSetSort = keyof typeof ECardSetSort;
