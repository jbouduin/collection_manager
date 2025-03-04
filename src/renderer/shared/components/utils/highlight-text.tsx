import * as React from "react";

function escapeRegExpChars(text: string) {
  /* eslint-disable-next-line no-useless-escape */
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// BUG if the toHighlight occurs multiple times in text, things got repeated
export function highlightText(text: string, toHighlight: string) {
  let lastIndex = 0;
  const words = toHighlight
    .split(/\s+/)
    .filter((word: string) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens = new Array<React.ReactNode>();
  let continueSearch = true;
  while (continueSearch) {
    const match = regexp.exec(text);
    if (!match) {
      continueSearch = false;
    } else {
      const length = match[0].length;
      const before = text.slice(lastIndex, regexp.lastIndex - length);
      if (before.length > 0) {
        tokens.push(before);
      }
      lastIndex = regexp.lastIndex;
      tokens.push(<b key={lastIndex}>{match[0]}</b>);
      const rest = text.slice(lastIndex);
      if (rest.length > 0) {
        tokens.push(rest);
      }
    }
  }
  return tokens;
}
