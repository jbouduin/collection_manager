import { inject, singleton } from "tsyringe";
import { ICardSetSyncOptions, ICardSyncOptions, ICatalogSyncOptions, ISyncParam, SyncOptions } from "../../../../common/ipc-params";
import SYNCTOKENS, { ICardSetSyncService, ICardSyncService, ICatalogSyncService, ISymbologySyncService } from "../../sync/interfaces";
import { IIpcSyncService } from "../interfaces";


@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly cardSetSyncService: ICardSetSyncService;
  private readonly cardSyncService: ICardSyncService;
  private readonly catalogSyncService: ICatalogSyncService;
  private readonly symbologySyncService: ISymbologySyncService;

  public constructor(
    @inject(SYNCTOKENS.CardSetSyncService) cardSetSyncService: ICardSetSyncService,
    @inject(SYNCTOKENS.CardSyncService) cardSyncService: ICardSyncService,
    @inject(SYNCTOKENS.CatalogSyncService) catalogSyncService: ICatalogSyncService,
    @inject(SYNCTOKENS.SymbologySyncService) symbologySyncService: ISymbologySyncService
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
