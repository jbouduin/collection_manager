import { CatalogType } from "../../enums";
import { BaseSyncOptions } from "./base-sync.options";

export interface CatalogSyncOptions extends BaseSyncOptions{
   catalogs: Array<CatalogType>;
}
