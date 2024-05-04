import { SymbologyAlternative } from "../../../main/database/schema/symbology-alternative.table";
import { SymbologyColorMap } from "../../../main/database/schema/symbology-color.map";
import { Symbology } from "../../../main/database/schema/symbology.table";

export interface SymbologySelectDto {
  symbology: Symbology;
  colors: Array<SymbologyColorMap>;
  alternatives: Array<SymbologyAlternative>;
}
