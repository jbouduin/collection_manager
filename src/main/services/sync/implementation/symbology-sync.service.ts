import { CardSymbol, Symbology } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { SymbologySelectDto } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc-params";
import INFRATOKENS, { IImageCacheService } from "../../infra/interfaces";
import REPOTOKENS, { ISymbologyRepository } from "../../repo/interfaces";
import { ISymbologySyncService } from "../interfaces/symbology-sync.service";

@injectable()
export class SymbologySyncService implements ISymbologySyncService {

  private readonly symbologyRepository: ISymbologyRepository;
  private readonly imageCacheService: IImageCacheService;

  public constructor(
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(REPOTOKENS.SymbologyRepository) symbologyRepository: ISymbologyRepository) {
    this.imageCacheService = imageCacheService;
    this.symbologyRepository = symbologyRepository;
  }

  public async sync(_options: null, progressCallback?: ProgressCallback): Promise<void> {
    console.log("start SymbologySyncService.sync");
    if (progressCallback) {
      progressCallback("Synchronizing card symbols");
    }
    return Symbology.all()
      .then((all: Array<CardSymbol>) => this.symbologyRepository.sync(all, progressCallback))
      .then(() => this.symbologyRepository.getAll()
        .then(async (allCardSymbols: Array<SymbologySelectDto>) => {
          let result = Promise.resolve();
          allCardSymbols.forEach(async (cardSymbol: SymbologySelectDto) => {
            result = result.then(() => this.imageCacheService.cacheCardSymbolSvg(cardSymbol.symbology));
          })
        })
      );
  }
}
