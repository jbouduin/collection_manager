import { BaseLookupResult } from "../base";


export interface ColorIdentityLookupResult extends BaseLookupResult {
  colorIdentitySortValue: string;
  symbols: Array<string>;
}
