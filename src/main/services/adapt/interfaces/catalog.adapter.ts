import { DatabaseSchema } from "../../../database/schema";
import { ITableAdapter } from "./table.adapter";

export type ICatalogAdapter = ITableAdapter<DatabaseSchema, "catalog_item">;
