import { DtoCardImageData } from "../../../../../common/dto";
import { CatalogType } from "../../../../../common/enums";
import { ProgressCallback } from "../../../../../common/ipc-params";
import { ScryfallCard, ScryfallCardSet, ScryfallCatalog, ScryfallRuling } from "../../types";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";


export interface IScryfallClient {
  fetchArrayBuffer(uri: string | URL): Promise<ArrayBuffer>;
  getCardImage(card: DtoCardImageData): Promise<ArrayBuffer>;
  getCardsForCardSet(cardSetCode: string, progressCallback: ProgressCallback): Promise<Array<ScryfallCard>>;
  getCardCollections(cardIds: Array<string>, progressCallback: ProgressCallback): Promise<Array<ScryfallCard>>;
  getCardSets(progressCallback: ProgressCallback): Promise<Array<ScryfallCardSet>>;
  getCardSymbols(progressCallback: ProgressCallback): Promise<Array<ScryfallCardSymbol>>;
  getCatalog(type: CatalogType, progressCallback: ProgressCallback): Promise<ScryfallCatalog>;
  getRulings(cardId: string): Promise<Array<ScryfallRuling>>;
}
