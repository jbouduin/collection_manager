import { Selectable } from "kysely";
import { CardSetTable, CardSymbolTable } from "../../../../main/database/schema";
import { MtgCardImageDataDto } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc";
import { IResult } from "../../base";


export interface IImageCacheService {
  cacheCardImage(card: MtgCardImageDataDto, onlyIfExists: boolean): Promise<void>;
  cacheCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>, progressCallback: ProgressCallback): Promise<void>;
  cacheCardSetSvg(cardSymbol: Selectable<CardSetTable>, progressCallback: ProgressCallback): Promise<void>;
  deleteCachedCardImage(card: MtgCardImageDataDto): void;
  getAsset(path: string): Promise<IResult<string>>;
  getCardImage(card: MtgCardImageDataDto): Promise<Response>;
  getCardSymbolSvg(cardSymbol: Selectable<CardSymbolTable>): string;
  getCardSetSvg(cardSet: Selectable<CardSetTable>): string;
}
