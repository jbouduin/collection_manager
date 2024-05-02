import { inject, singleton } from "tsyringe";
import { ESyncType } from "../../../common/enums";
import { ICardSetSyncOptions, ICatalogSyncOptions, ISyncParam, SyncOptions } from "../../../common/ipc-params";
import { ICardSetSyncService } from "../sync/card-set-sync.service";
import { ICatalogSyncService } from "../sync/catalog-sync.service";
import TOKENS from "../tokens";


export interface IIpcSyncService {
  handle(params: ISyncParam<SyncOptions>): void;
}

@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly cardSetSyncService: ICardSetSyncService;
  private readonly catalogSyncService: ICatalogSyncService;

  public constructor(
    @inject(TOKENS.CardSetSyncService) cardSetSyncService: ICardSetSyncService,
    @inject(TOKENS.CatalogSyncService) catalogSyncService: ICatalogSyncService
  ) {
    this.cardSetSyncService = cardSetSyncService;
    this.catalogSyncService = catalogSyncService;
  }

  public async handle(params: ISyncParam<SyncOptions>): Promise<void> {

    console.log("handling sync", params);
    switch (params.type) {
      case ESyncType.CardSets:
        await this.cardSetSyncService.sync((params as ISyncParam<ICardSetSyncOptions>).options);
        break;
      case ESyncType.Catalogs:
        await this.catalogSyncService.sync((params as ISyncParam<ICatalogSyncOptions>).options);
        break;
    }
  }
}
