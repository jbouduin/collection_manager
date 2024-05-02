import { inject, singleton } from "tsyringe";
import { ESyncType } from "../../../common/enums";
import { ICardSetSyncOptions, ICatalogSyncOptions, ISyncParam } from "../../../common/ipc-params";
import { ICardSetSyncService } from "../sync/card-set-sync.service";
import { ICatalogSyncService } from "../sync/catalog-sync.service";
import TOKENS from "../tokens";


export interface IIpcSyncService {
  handle(updateType: ESyncType): void;
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

  public async handle(...args: Array<any>): Promise<void> {
    const params = args[0] as ISyncParam<any>;
    console.log('handling sync', params);
    switch (params.type) {
      case ESyncType.CardSets:
        await this.cardSetSyncService.sync((args[0] as ISyncParam<ICardSetSyncOptions>).options);
        break;
      case ESyncType.Catalogs:
        await this.catalogSyncService.sync((args[0] as ISyncParam<ICatalogSyncOptions>).options);
        break;
    }
  }

}
