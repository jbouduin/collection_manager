import { inject, injectable } from "tsyringe";

import { RulingsByCardIdSelectDto } from "../../../../common/dto";
import { IQueryOrSyncParam, QueryOrSyncOptions, RulingQueryOrSyncOptions } from "../../../../common/ipc-params";
import { Card } from "../../../../main/database/schema";
import REPOTOKENS, { ICardRepository, IRulingRepository } from "../../repo/interfaces";
import SYNCTOKENS, { IRulingSyncService } from "../../sync/interfaces";
import { IIpcQueryOrSyncService } from "../interfaces";


@injectable()
export class IpcQueryOrSyncService implements IIpcQueryOrSyncService {

  private readonly cardRepository: ICardRepository;
  private readonly rulingRepository: IRulingRepository;
  private readonly rulingSyncService: IRulingSyncService;

  public constructor(
    @inject(REPOTOKENS.CardRepository) cardRepository: ICardRepository,
    @inject(REPOTOKENS.RulingRepository) rulingRepository: IRulingRepository,
    @inject(SYNCTOKENS.RulingSyncService) rulingSyncService: IRulingSyncService
  ) {
    this.cardRepository = cardRepository;
    this.rulingRepository = rulingRepository;
    this.rulingSyncService = rulingSyncService;
  }

  public async handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<void | RulingsByCardIdSelectDto> {
    console.log("start IpcQueryOrSyncService.handle", params);
    switch (params.type) {
      case "Ruling":
        return this.rulingRepository.getByCardId((params.options as RulingQueryOrSyncOptions).cardId)
          .then((queryResult: RulingsByCardIdSelectDto) => {
            if (queryResult.length == 0) {
              return this.cardRepository.getCardById((params.options as RulingQueryOrSyncOptions).cardId)
                .then((card: Card) => this.rulingSyncService.sync({ oracleId: card.oracle_id }))
                .then(() => this.rulingRepository.getByCardId((params.options as RulingQueryOrSyncOptions).cardId));
            } else {
              return queryResult;
            }
          })
          .then((queryResult: RulingsByCardIdSelectDto) => {
            console.log("end IpcQueryOrSyncService.handling");
            return queryResult;
          });
      default:
        return Promise.resolve();
    }
  }
}
