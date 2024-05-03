import { inject, singleton } from "tsyringe";
import { ICardSetSyncOptions, ICardSyncOptions, ICatalogSyncOptions, ISyncParam, SyncOptions } from "../../../common/ipc-params";
import { ICardSetSyncService } from "../sync/card-set-sync.service";
import { ICatalogSyncService } from "../sync/catalog-sync.service";
import TOKENS from "../tokens";
import { ICardSyncService } from "../sync/card-sync.service";
import { ISymbologySyncService } from "../sync/symbology-sync.service";


export interface IIpcSyncService {
  handle(params: ISyncParam<SyncOptions>): void;
}

@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly cardSetSyncService: ICardSetSyncService;
  private readonly cardSyncService: ICardSyncService;
  private readonly catalogSyncService: ICatalogSyncService;
  private readonly symbologySyncService: ISymbologySyncService;

  public constructor(
    @inject(TOKENS.CardSetSyncService) cardSetSyncService: ICardSetSyncService,
    @inject(TOKENS.CardSyncService) cardSyncService: ICardSyncService,
    @inject(TOKENS.CatalogSyncService) catalogSyncService: ICatalogSyncService,
    @inject(TOKENS.SymbologySyncService) symbologySyncService: ISymbologySyncService
  ) {
    this.cardSetSyncService = cardSetSyncService;
    this.cardSyncService = cardSyncService;
    this.catalogSyncService = catalogSyncService;
    this.symbologySyncService = symbologySyncService;
  }

  public async handle(params: ISyncParam<SyncOptions>): Promise<void> {

    console.log("handling sync", params);
    switch (params.type) {
      case "CardSets":
        await this.cardSetSyncService.sync((params as ISyncParam<ICardSetSyncOptions>).options);
        break;
      case "Cards":
        await this.cardSyncService.sync((params as ISyncParam<ICardSyncOptions>).options);
        break;
      case "Catalogs":
        await this.catalogSyncService.sync((params as ISyncParam<ICatalogSyncOptions>).options);
        break;
      case "Symbology":
        await this.symbologySyncService.sync(undefined);
        break;
    }
  }
}
