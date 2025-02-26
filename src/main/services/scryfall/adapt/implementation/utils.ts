export function scryfallDateToIsoString(scryfall: string): string | null {
  if (scryfall?.length > 0) {
    const split = scryfall.split("-");
    if (split.length != 3) {
      return null;
    } else {
      try {
        return new Date(Date.UTC(parseInt(split[0]), parseInt(split[1]) - 1, parseInt(split[2]), 8, 0, 0)).toISOString();
      } catch {
        return null;
      }
    }
  } else {
    return null;
  }
}

export function scryfallBooleanToNumber(scryfall: boolean): number {
  return scryfall ? 1 : 0;
}
