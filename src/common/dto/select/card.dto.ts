import { Selectable } from "kysely";
import { CardFaceColorMapTable, CardFaceLocalizationTable, CardfaceTable, CardTable } from "../../../main/database/schema";
import { OracleDto } from "..";

export interface CardDto {
  card: Selectable<CardTable>;
  cardfaces: Array<CardfaceDto>;
  oracle: OracleDto;
  collectorNumberSortValue: string;
}

export interface CardfaceDto {
  cardface: Selectable<CardfaceTable>;
  localizations: Array<Selectable<CardFaceLocalizationTable>>;
  colorMaps: Array<Selectable<CardFaceColorMapTable>>;
  manaCostArray: Array<string>;
}
