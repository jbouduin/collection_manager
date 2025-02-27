import { Selectable } from "kysely";
import { CatalogItemTable } from "../../../../main/database/schema";

export type CatalogItemDto = Selectable<CatalogItemTable>;
