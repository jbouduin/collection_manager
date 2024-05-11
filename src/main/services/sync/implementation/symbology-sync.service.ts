import { CardSymbol, Symbology } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

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

  public async sync(options: null, progressCallback?: (label: string) => void): Promise<void> {
    console.log("start SymboloySyncService.sync");
    if (progressCallback) {
      progressCallback("sync card symbols");
    }
    return Symbology.all().then((all: Array<CardSymbol>) => this.symbologyRepository.sync(all));
  }
}
