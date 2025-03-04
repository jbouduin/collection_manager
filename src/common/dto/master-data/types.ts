import { Selectable } from "kysely";
import { CatalogItemTable, ColorTable } from "../../../main/database/schema";


export type CatalogItemDto = Selectable<CatalogItemTable>;
export type ColorDto = Selectable<ColorTable>;
