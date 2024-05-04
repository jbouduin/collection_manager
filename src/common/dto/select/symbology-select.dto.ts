import { SymbologyAlternative } from "../../../main/database/schema/symbology/symbology-alternative.table";
import { SymbologyColorMap } from "../../../main/database/schema/symbology/symbology-color.map";
import { Symbology } from "../../../main/database/schema/symbology/symbology.table";

export interface SymbologySelectDto {
  symbology: Symbology;
  colors: Array<SymbologyColorMap>;
  alternatives: Array<SymbologyAlternative>;
}
