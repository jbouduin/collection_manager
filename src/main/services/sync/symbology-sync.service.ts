import { Symbology } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import { ICardSetSyncOptions } from "../../../common/ipc-params";
import { ISymbologyRepository } from "../database/repositories";
import TOKENS from "../tokens";
import { IBaseSyncService } from "./base-sync.service";

export type ISymbologySyncService = IBaseSyncService<ICardSetSyncOptions>;

@injectable()
export class SymbologySyncService implements IBaseSyncService<undefined> {

  private readonly symbologyRepository: ISymbologyRepository;

  public constructor(
    @inject(TOKENS.SymbologyRepository) symbologyRepository: ISymbologyRepository
  ) {
    this.symbologyRepository = symbologyRepository;
  }

  public async sync(): Promise<void> {
    console.log("sync symbology");
    const symbols = await Symbology.all();
    await this.symbologyRepository.sync(symbols);
  }
}
