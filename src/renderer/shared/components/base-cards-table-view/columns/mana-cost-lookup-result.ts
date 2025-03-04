import { BaseLookupResult } from "../../base-table";


export interface ManaCostLookupResult extends BaseLookupResult {
  convertedManaCost: number;
  symbols: Array<string>;
}
