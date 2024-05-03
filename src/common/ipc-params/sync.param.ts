import { SyncOptions } from ".";
import { SyncType } from "../enums/sync-type.enum";

export interface ISyncParam<T extends SyncOptions> {
  type: SyncType;
  options: T
}
