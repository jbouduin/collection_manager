/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardSecurityStamp {
  oval,
  triangle,
  acorn,
  circle,
  arena,
  heart
}

export type CardSecurityStamp = keyof typeof ECardSecurityStamp;
