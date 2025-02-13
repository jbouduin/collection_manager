import { AssetQueryOptions } from "./asset-query.options";
import { CardQueryOptions } from "./card-query.options";
import { CardSetDetailsQueryOptions } from "./card-set-detail-query.options";
import { LegalityQueryOptions } from "./legality-query.options";
import { QueryType } from "./query-type.enum";
import { RulingQueryOptions } from "./ruling-query.options";


export type QueryOptions = CardQueryOptions | RulingQueryOptions | LegalityQueryOptions | AssetQueryOptions | CardSetDetailsQueryOptions | null;

export interface QueryParam<T extends QueryOptions> {
  type: QueryType;
  options: T;
}
