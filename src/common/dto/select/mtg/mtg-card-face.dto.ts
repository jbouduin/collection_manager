import { Selectable } from "kysely";
import { CardfaceTable } from "../../../../main/database/schema";
import { CardfaceColorDto, OracleDto } from "./types";


export interface MtgCardfaceDto extends Selectable<CardfaceTable> {
  cardfaceColors: Array<CardfaceColorDto>;
  oracle: OracleDto;
}
