import { Selectable } from "kysely";
import { CatalogItemTable, ColorTable, GameFormatTable } from "../../../main/database/schema";


export type CatalogItemDto = Selectable<CatalogItemTable>;
export type ColorDto = Selectable<ColorTable>;
export type GameFormatDto = Selectable<GameFormatTable>;
export type DeckSizeQuantityOperator = "<=" | ">=" | "==";
export type NumberOfCardsQuantityOperator = "<=" | "==";
