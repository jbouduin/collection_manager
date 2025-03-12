import { Selectable } from "kysely";
import { CardfaceTable } from "../../../main/database/schema";
import { ICardfaceColorDto, IOracleDto } from "./types";


export interface IMtgCardfaceDto extends Selectable<CardfaceTable> {
  cardfaceColors: Array<ICardfaceColorDto>;
  oracle: IOracleDto;
}
