import { Selectable } from "kysely";
import { CatalogItemTable, ColorTable, GameFormatTable } from "../../../main/database/schema";


export type ICatalogItemDto = Selectable<CatalogItemTable>;
export type IColorDto = Selectable<ColorTable>;
export type IGameFormatDto = Selectable<GameFormatTable>;
export type IDeckSizeQuantityOperator = "<=" | ">=" | "==";
export type INumberOfCardsQuantityOperator = "<=" | "==";
