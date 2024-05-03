import { SymbologyAlternative } from "../../../main/services/database/schema/symbology-alternative.table";
import { SymbologyColorMap } from "../../../main/services/database/schema/symbology-color.map";
import { Symbology } from "../../../main/services/database/schema/symbology.table";

export interface SymbologySelectDto {
  symbology: Symbology;
  colors: Array<SymbologyColorMap>;
  alternatives: Array<SymbologyAlternative>;
}
