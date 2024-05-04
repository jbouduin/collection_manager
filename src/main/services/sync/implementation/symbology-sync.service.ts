import { Symbology } from "scryfall-sdk";
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

  public async sync(): Promise<void> {
    console.log("sync symbology");
    const symbols = await Symbology.all();
    await this.symbologyRepository.sync(symbols);
  }
}
