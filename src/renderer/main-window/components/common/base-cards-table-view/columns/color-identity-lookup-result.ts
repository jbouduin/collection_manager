import { BaseLookupResult } from "./base-lookup-result";


export interface ColorIdentityLookupResult extends BaseLookupResult {
  colorIdentitySortValue: string;
  symbols: Array<string>;
}
