import { Selectable } from "kysely";
import { CardfaceTable } from "../../../../main/database/schema";
import { CardfaceColorDto, OracleDto } from "./types";


export interface CardfaceDto extends Selectable<CardfaceTable> {
  cardfaceColors: Array<CardfaceColorDto>;
  oracle: OracleDto;
}
