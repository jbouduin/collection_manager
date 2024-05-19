import { CardSyncOptions } from "../../../../../common/ipc-params";
import { CatalogType } from "../../../../../common/enums";
import { ScryfallCard, ScryfallCardSet, ScryfallCatalog, ScryfallRuling } from "../../types";


export interface IScryfallClient {
  fetchSvg(uri: string): Promise<ArrayBuffer>;
  fetchImage(uri: string): Promise<ReadableStream<Uint8Array>>;
  getCards(options: CardSyncOptions): Promise<Array<ScryfallCard>>
  getCardSets(): Promise<Array<ScryfallCardSet>>;
  getCatalog(type: CatalogType): Promise<ScryfallCatalog>;
  getRulings(cardId: string): Promise<Array<ScryfallRuling>>
}
