import { IMtgCardImageDataDto, IScryfallBulkDataItemDto } from "../../../../../common/dto";
import { ProgressCallback } from "../../../../../common/ipc";
import { CatalogType } from "../../../../../common/types";
import { IScryfallCardDto, IScryfallCardSetDto, IScryfallCatalogDto, IScryfallRulingDto } from "../../dto";
import { IScryfallCardSymbolDto } from "../../dto/card-symbol/scryfall-card-symbol.dto";


export interface IScryfallClient {
  downloadBulkData(uri: string, targetFile: string): Promise<void>;
  fetchArrayBuffer(uri: string | URL): Promise<ArrayBuffer>;
  getAllCards(): Promise<Array<IScryfallCardDto>>;
  // LATER getAllRulings(): Promise<Array<ScryfallRuling>>;
  getBulkDefinitions(): Promise<Array<IScryfallBulkDataItemDto>>;
  getCardImage(card: IMtgCardImageDataDto): Promise<ArrayBuffer>;
  getCardsForCardSet(cardSetCode: string, progressCallback: ProgressCallback): Promise<Array<IScryfallCardDto>>;
  getCardCollections(cardIds: Array<string>, progressCallback: ProgressCallback): Promise<Array<IScryfallCardDto>>;
  getCardSets(progressCallback: ProgressCallback): Promise<Array<IScryfallCardSetDto>>;
  getCardSymbols(progressCallback: ProgressCallback): Promise<Array<IScryfallCardSymbolDto>>;
  getCatalog(type: CatalogType, progressCallback: ProgressCallback): Promise<IScryfallCatalogDto>;
  getRulings(cardId: string): Promise<Array<IScryfallRulingDto>>;
}
