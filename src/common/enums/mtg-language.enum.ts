/* eslint-disable @typescript-eslint/no-unused-vars */
enum EMTGLanguage {
  en,
  es,
  fr,
  de,
  it,
  pt,
  ja,
  ko,
  ru,
  zhs,
  zht,
  he,
  la,
  grc,
  ar,
  sa,
  ph
}

export type MTGLanguage = keyof typeof EMTGLanguage;
