import { BaseSyncOptions } from "./base-sync.options";

export interface CardSetSyncOptions extends BaseSyncOptions {
  code: string | null;
}
