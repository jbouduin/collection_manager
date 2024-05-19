import { CardQueryOptions } from "./card-query.options";
import { QueryType } from "./query-type.enum";
import { RulingQueryOptions } from "./ruling-query.options";


export type QueryOptions = CardQueryOptions | RulingQueryOptions | null;

export interface QueryParam<T extends QueryOptions> {
  type: QueryType;
  options: T
}
