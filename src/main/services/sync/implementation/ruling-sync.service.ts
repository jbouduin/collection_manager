import { Ruling as ScryfallRuling, Rulings } from "scryfall-sdk";
import { RulingSyncOptions } from "../../../../common/ipc-params";
import { IRulingSyncService } from "../interfaces";
import { inject, injectable } from "tsyringe";
import REPOTOKENS, { IRulingRepository } from "../../repo/interfaces";

@injectable()
export class RulingSyncService implements IRulingSyncService{

  private rulingRepository: IRulingRepository;

  public constructor(@inject(REPOTOKENS.RulingRepository) rulingRepository: IRulingRepository) {
    this.rulingRepository = rulingRepository;
  }

  public async sync(options: RulingSyncOptions, progressCallback?: (label: string) => void): Promise<void> {
    console.log("start RulingSyncService.sync");
    if (progressCallback) {
      progressCallback("sync rulings");
    }
    return Rulings.byId(options.oracleId)
      .then((scryFall: Array<ScryfallRuling>) => this.rulingRepository.sync(scryFall));
  }
}
