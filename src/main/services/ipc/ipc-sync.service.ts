import { inject, singleton } from "tsyringe";
import { ESyncType } from "../../../common/enums";
import { IBaseSyncParam, ICatalogSyncParam } from "../../../common/ipc-params";
import { ICatalogSyncService } from "../sync/catalog-sync.service";
import TOKENS from "../tokens";


export interface IIpcSyncService {
  handle(updateType: ESyncType): void;
}

@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly catalogSyncService: ICatalogSyncService;

  public constructor(
    @inject(TOKENS.CatalogSyncService) catalogSyncService: ICatalogSyncService
  ) {
    this.catalogSyncService = catalogSyncService;
  }

  public async handle(...args: Array<any>): Promise<void> {
    const params = args[0] as IBaseSyncParam;
    console.log('handling sync', params);
    switch (params.type) {
      case ESyncType.Catalogs:
        await this.catalogSyncService.sync(args[0] as ICatalogSyncParam);
        break;
    }
  }

}
