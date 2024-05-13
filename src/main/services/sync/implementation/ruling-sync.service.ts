import { Rulings, Ruling as ScryfallRuling } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { ProgressCallback, RulingSyncOptions } from "../../../../common/ipc-params";
import REPOTOKENS, { IRulingRepository } from "../../repo/interfaces";
import { IRulingSyncService } from "../interfaces";


@injectable()
export class RulingSyncService implements IRulingSyncService{

  private rulingRepository: IRulingRepository;

  public constructor(@inject(REPOTOKENS.RulingRepository) rulingRepository: IRulingRepository) {
    this.rulingRepository = rulingRepository;
  }

  public async sync(options: RulingSyncOptions, progressCallback?: ProgressCallback): Promise<void> {
    console.log("start RulingSyncService.sync");
    if (progressCallback) {
      progressCallback("sync rulings");
    }
    return Rulings.byId(options.oracleId)
      .then((scryFall: Array<ScryfallRuling>) => this.rulingRepository.sync(scryFall));
  }
}
