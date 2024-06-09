import { Selectable } from "kysely";

import { CardSetTable, CardSymbolTable } from "../../../../main/database/schema";
import { CardImageDto } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc-params";

export interface IImageCacheService {
  cacheCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>, progressCallback: ProgressCallback): Promise<void>;
  cacheCardSetSvg(cardSymbol: Selectable<CardSetTable>, progressCallback: ProgressCallback): Promise<void>;
  getAsset(path: string): Promise<string>;
  getCardImage(card: CardImageDto): Promise<Response>;
  getCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): string;
  getCardSetSvg(cardSet: Selectable<CardSetTable>): string;
}
