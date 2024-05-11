import { CardSymbol, Symbology } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { ProgressCallback } from "../../infra/implementation";
import REPOTOKENS, { ISymbologyRepository } from "../../repo/interfaces";
import { ISymbologySyncService } from "../interfaces/symbology-sync.service";

@injectable()
export class SymbologySyncService implements ISymbologySyncService {

  private readonly symbologyRepository: ISymbologyRepository;

  public constructor(
    @inject(REPOTOKENS.SymbologyRepository) symbologyRepository: ISymbologyRepository
  ) {
    this.symbologyRepository = symbologyRepository;
  }

  public async sync(options: null, progressCallback?: ProgressCallback): Promise<void> {
    console.log("start SymboloySyncService.sync");
    if (progressCallback) {
      progressCallback("start sync card symbols");
    }
    return Symbology.all().then((all: Array<CardSymbol>) => this.symbologyRepository.sync(all, progressCallback));
  }
}
