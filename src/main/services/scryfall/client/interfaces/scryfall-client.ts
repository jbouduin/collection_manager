import { CatalogType } from "../../../../../common/enums";
import { ProgressCallback } from "../../../../../common/ipc-params";
import { ScryfallCard, ScryfallCardSet, ScryfallCatalog, ScryfallRuling } from "../../types";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";


export interface IScryfallClient {
  fetchSvg(uri: string): Promise<ArrayBuffer>;
  fetchImage(uri: string): Promise<ReadableStream<Uint8Array>>;
  getCardsForCardSet(cardSetCode: string, progressCallback: ProgressCallback): Promise<Array<ScryfallCard>>;
  getCardCollections(cardIds: Array<string>, progressCallback: ProgressCallback): Promise<Array<ScryfallCard>>;
  getCardSets(progressCallback: ProgressCallback): Promise<Array<ScryfallCardSet>>;
  getCardSymbols(progressCallback: ProgressCallback): Promise<Array<ScryfallCardSymbol>>;
  getCatalog(type: CatalogType, progressCallback: ProgressCallback): Promise<ScryfallCatalog>;
  getRulings(cardId: string): Promise<Array<ScryfallRuling>>;
}
