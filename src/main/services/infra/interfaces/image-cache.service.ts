import { CardSet, Symbology } from "../../../../main/database/schema";
import { CardImageDto } from "../../../../common/dto";

export interface IImageCacheService {
  cacheCardSymbolSvg(cardSymbol: Symbology): Promise<void>;
  cacheCardSetSvg(cardSymbol: CardSet): Promise<void>;
  getCardImage(card: CardImageDto): Promise<Response>;
  getCardSymbolSvg(cardSymbol: Symbology): string;
  getCardSetSvg(cardSet: CardSet): string;
}
