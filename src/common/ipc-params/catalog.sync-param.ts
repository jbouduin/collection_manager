import { ECatalogType } from "../enums";
import { IBaseSyncParam } from "./base.sync-param";

export interface ICatalogSyncParam extends IBaseSyncParam {
  catalogs: Array<ECatalogType>;
}
