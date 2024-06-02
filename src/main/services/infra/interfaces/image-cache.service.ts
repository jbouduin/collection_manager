import { Selectable } from "kysely";

import { CardSetTable, CardSymbolTable } from "../../../../main/database/schema";
import { CardImageDto } from "../../../../common/dto";

export interface IImageCacheService {
  cacheCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): Promise<void>;
  cacheCardSetSvg(cardSymbol: Selectable<CardSetTable>): Promise<void>;
  getAsset(path: string): Promise<string>;
  getCardImage(card: CardImageDto): Promise<Response>;
  getCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): string;
  getCardSetSvg(cardSet: Selectable<CardSetTable>): string;
}
