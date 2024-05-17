import { QueryOptions, QueryType } from ".";

export interface IQueryParam<T extends QueryOptions> {
  type: QueryType;
  options: T
}
