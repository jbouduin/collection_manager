import { QueryOrSyncOptions, QueryOrSyncType } from ".";

export interface IQueryOrSyncParam<T extends QueryOrSyncOptions> {
  type: QueryOrSyncType;
  options: T
}
