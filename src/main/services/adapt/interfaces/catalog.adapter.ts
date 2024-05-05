import { DatabaseSchema } from "../../../database/schema";
import { IBaseAdapter } from "./base.adapter";

export type ICatalogAdapter = IBaseAdapter<DatabaseSchema, "catalog_item">;
