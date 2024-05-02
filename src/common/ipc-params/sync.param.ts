import { SyncOptions } from ".";
import { ESyncType } from "../enums/sync-type.enum";

export interface ISyncParam<T extends SyncOptions> {
  type: ESyncType;
  options: T
}
