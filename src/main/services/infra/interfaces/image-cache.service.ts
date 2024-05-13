import { CardImageSelectDto, SymbologySelectDto } from "../../../../common/dto";

export interface IImageCacheService {
  cacheCardImage(card: CardImageSelectDto): Promise<void>;
  cacheSymbologyImage(cardSymbol: SymbologySelectDto): Promise<void>;
  getCachedImage(localUrl: string): Promise<Response>;
  getCardSymbolSvg(cardSymbol: SymbologySelectDto): string;
  pathToCachedCardSymbolImage(cardSymbol: SymbologySelectDto): string;
}
