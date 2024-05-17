import { Symbology, SymbologyAlternative, SymbologyColorMap } from "../../../main/database/schema";

export interface SymbologyDto {
  symbology: Symbology;
  colors: Array<SymbologyColorMap>;
  alternatives: Array<SymbologyAlternative>;
}

// LATER would be nice to have it like but then we need an efficient way to construct it
// export interface SymbologySelectDto extends Symbology {
//   colors: Array<SymbologyColorMap>;
//   alternatives: Array<SymbologyAlternative>;
// }
// or
// export type SymbologySelectDto = Symbology & {
//   colors: Array<SymbologyColorMap>;
//   alternatives: Array<SymbologyAlternative>;
// }
