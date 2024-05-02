import { inject, singleton } from "tsyringe";
import { ESyncType } from "../../../common/enums";
import { ICardSetSyncOptions, ICardSyncOptions, ICatalogSyncOptions, ISyncParam, SyncOptions } from "../../../common/ipc-params";
import { ICardSetSyncService } from "../sync/card-set-sync.service";
import { ICatalogSyncService } from "../sync/catalog-sync.service";
import TOKENS from "../tokens";
import { ICardSyncService } from "../sync/card-sync.service";


export interface IIpcSyncService {
  handle(params: ISyncParam<SyncOptions>): void;
}

@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly cardSetSyncService: ICardSetSyncService;
  private readonly cardSyncService: ICardSyncService;
  private readonly catalogSyncService: ICatalogSyncService;

  public constructor(
    @inject(TOKENS.CardSetSyncService) cardSetSyncService: ICardSetSyncService,
    @inject(TOKENS.CardSyncService) cardSyncService: ICardSyncService,
    @inject(TOKENS.CatalogSyncService) catalogSyncService: ICatalogSyncService
  ) {
    this.cardSetSyncService = cardSetSyncService;
    this.cardSyncService = cardSyncService;
    this.catalogSyncService = catalogSyncService;
  }

  public async handle(params: ISyncParam<SyncOptions>): Promise<void> {

    console.log("handling sync", params);
    switch (params.type) {
      case ESyncType.CardSets:
        await this.cardSetSyncService.sync((params as ISyncParam<ICardSetSyncOptions>).options);
        break;
      case ESyncType.Cards:
        await this.cardSyncService.sync((params as ISyncParam<ICardSyncOptions>).options);
        break;
      case ESyncType.Catalogs:
        await this.catalogSyncService.sync((params as ISyncParam<ICatalogSyncOptions>).options);
        break;
    }
  }
}
