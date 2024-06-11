import { Selectable } from "kysely";

import { CardSetTable, CardSymbolTable } from "../../../../main/database/schema";
import { DtoCardImageData } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc-params";

export interface IImageCacheService {
  cacheCardImage(card: DtoCardImageData, onlyIfExists: boolean): Promise<void>;
  cacheCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>, progressCallback: ProgressCallback): Promise<void>;
  cacheCardSetSvg(cardSymbol: Selectable<CardSetTable>, progressCallback: ProgressCallback): Promise<void>;
  deleteCachedCardImage(card: DtoCardImageData): void;
  getAsset(path: string): Promise<string>;
  getCardImage(card: DtoCardImageData): Promise<Response>;
  getCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): string;
  getCardSetSvg(cardSet: Selectable<CardSetTable>): string;
}
