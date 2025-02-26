import { BaseLookupResult } from "./base-lookup-result";


export interface ManaCostLookupResult extends BaseLookupResult {
  convertedManaCost: number;
  symbols: Array<string>;
}
