import { container, injectable } from "tsyringe";

import { RulingsByCardIdSelectDto } from "../../../../common/dto";
import { IQueryOrSyncParam, QueryOrSyncOptions, RulingQueryOrSyncOptions } from "../../../../common/ipc-params";
import REPOTOKENS, { IRulingRepository } from "../../repo/interfaces";
import SYNCTOKENS, { IRulingSyncService } from "../../sync/interfaces";
import { IIpcQueryOrSyncService } from "../interfaces";

// NOW get rid of this service
@injectable()
export class IpcQueryOrSyncService implements IIpcQueryOrSyncService {


  public async handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<void | RulingsByCardIdSelectDto> {
    console.log("start IpcQueryOrSyncService.handle", params);
    switch (params.type) {
      // NOW handle this as normal query and sync the thing when required
      case "Ruling":
        return this.handleRuling(params.options as RulingQueryOrSyncOptions);
      default:
        return Promise.resolve();
    }
  }

  private async handleRuling(options: RulingQueryOrSyncOptions): Promise<RulingsByCardIdSelectDto> {
    const rulingRepository = container.resolve<IRulingRepository>(REPOTOKENS.RulingRepository);
    // NOW if there are no rulings, but we already synced, we do not have to resync
    return rulingRepository.getByCardId(options.cardId)
      .then((queryResult: RulingsByCardIdSelectDto) => {
        if (queryResult.length == 0) {
          return container.resolve<IRulingSyncService>(SYNCTOKENS.RulingSyncService).sync({ cardId: options.cardId })
            .then(() => rulingRepository.getByCardId(options.cardId));
        } else {
          return queryResult;
        }
      })
      .then((queryResult: RulingsByCardIdSelectDto) => {
        console.log("end IpcQueryOrSyncService.handling");
        return queryResult;
      });
  }
}
