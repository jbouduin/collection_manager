import { CardSet, Symbology } from "../../../../main/database/schema";
import { CardImageSelectDto } from "../../../../common/dto";

export interface IImageCacheService {
  cacheCardImage(card: CardImageSelectDto): Promise<void>;
  cacheCardSymbolSvg(cardSymbol: Symbology): Promise<void>;
  cacheCardSetSvg(cardSymbol: CardSet): Promise<void>;
  getCachedImage(localUrl: string): Promise<Response>;
  getCardSymbolSvg(cardSymbol: Symbology): string;
  getCardSetSvg(cardSet: CardSet): string;
}
