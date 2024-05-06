import { Symbology, SymbologyAlternative, SymbologyColorMap } from "../../../main/database/schema";

export interface SymbologySelectDto {
  symbology: Symbology;
  colors: Array<SymbologyColorMap>;
  alternatives: Array<SymbologyAlternative>;
}
