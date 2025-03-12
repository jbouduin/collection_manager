import { Selectable } from "kysely";
import { CardSymbolTable } from "../../../main/database/schema";
import { IMtgCardSymbolAlternative, IMtgCardSymbolColorMapDto } from "./types";

export interface IMtgCardSymbolDto extends Selectable<CardSymbolTable> {
  colors: Array<IMtgCardSymbolColorMapDto>;
  alternatives: Array<IMtgCardSymbolAlternative>;
}
