import { BaseSyncOptions } from "./base-sync.options";

export interface CardSyncOptions extends BaseSyncOptions{
  setCode?: string;
  cardIds?: Array<string>;
}
