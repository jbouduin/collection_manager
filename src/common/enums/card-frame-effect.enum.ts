/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardFrameEffect {
  legendary,
  miracle,
  nyxtouched,
  draft,
  devoid,
  tombstone,
  colorshifted,
  inverted,
  sunmoondfc,
  compasslanddfc,
  originpwdfc,
  mooneldrazidfc,
  moonreversemoondfc,
  showcase,
  extendedart,
  companion,
  etched,
  snow,
  lesson,
  shatteredglass,
  convertdfc,
  fandfc,
  upsidedowndfc
}

export type CardFrameEffect = keyof typeof ECardFrameEffect;
