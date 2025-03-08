import { BaseLookupResult } from "../base";


export interface ManaCostLookupResult extends BaseLookupResult {
  convertedManaCost: number;
  symbols: Array<string>;
}
