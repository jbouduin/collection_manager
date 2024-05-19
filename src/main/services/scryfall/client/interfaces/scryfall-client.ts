import { CardSyncOptions } from "../../../../../common/ipc-params";
import { CatalogType } from "../../../../../common/enums";
import { ScryfallCard, ScryfallCardSet, ScryfallCatalog, ScryfallRuling } from "../../types";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";


export interface IScryfallClient {
  fetchSvg(uri: string): Promise<ArrayBuffer>;
  fetchImage(uri: string): Promise<ReadableStream<Uint8Array>>;
  getCards(options: CardSyncOptions): Promise<Array<ScryfallCard>>
  getCardSets(): Promise<Array<ScryfallCardSet>>;
  getCardSymbols(): Promise<Array<ScryfallCardSymbol>>;
  getCatalog(type: CatalogType): Promise<ScryfallCatalog>;
  getRulings(cardId: string): Promise<Array<ScryfallRuling>>;
}
