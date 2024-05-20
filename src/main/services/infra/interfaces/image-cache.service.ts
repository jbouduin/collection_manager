import { CardSet, CardSymbol } from "../../../../main/database/schema";
import { CardImageDto } from "../../../../common/dto";

export interface IImageCacheService {
  cacheCardSymbolSvg(cardSymbol: CardSymbol): Promise<void>;
  cacheCardSetSvg(cardSymbol: CardSet): Promise<void>;
  getCardImage(card: CardImageDto): Promise<Response>;
  getCardSymbolSvg(cardSymbol: CardSymbol): string;
  getCardSetSvg(cardSet: CardSet): string;
}
