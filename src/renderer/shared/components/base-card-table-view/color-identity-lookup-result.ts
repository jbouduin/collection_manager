import { BaseLookupResult } from "../base-table";


export interface ColorIdentityLookupResult extends BaseLookupResult {
  colorIdentitySortValue: string;
  symbols: Array<string>;
}
