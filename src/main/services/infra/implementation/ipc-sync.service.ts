import { inject, singleton } from "tsyringe";

import { CardSetSyncOptions, CardSyncOptions, CatalogSyncOptions, IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";
import SYNCTOKENS, { ICardSetSyncService, ICardSyncService, ICatalogSyncService, ISymbologySyncService } from "../../sync/interfaces";
import { IIpcSyncService } from "../interfaces";


@singleton()
export class IpcSyncService implements IIpcSyncService {

  private readonly cardSetSyncService: ICardSetSyncService;
  private readonly cardSyncService: ICardSyncService;
  private readonly catalogSyncService: ICatalogSyncService;
  // private readonly rulingSyncService: IRulingSyncService;
  private readonly symbologySyncService: ISymbologySyncService;

  public constructor(
    @inject(SYNCTOKENS.CardSetSyncService) cardSetSyncService: ICardSetSyncService,
    @inject(SYNCTOKENS.CardSyncService) cardSyncService: ICardSyncService,
    @inject(SYNCTOKENS.CatalogSyncService) catalogSyncService: ICatalogSyncService,
    // @inject(SYNCTOKENS.RulingSyncService) rulingSyncService: IRulingSyncService,
    @inject(SYNCTOKENS.SymbologySyncService) symbologySyncService: ISymbologySyncService
  ) {
    this.cardSetSyncService = cardSetSyncService;
    this.cardSyncService = cardSyncService;
    this.catalogSyncService = catalogSyncService;
    // this.rulingSyncService = rulingSyncService;
    this.symbologySyncService = symbologySyncService;
  }

  public async handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<void> {

    console.log("start IpcSyncService.handling", params);
    switch (params.type) {
      case "CardSet":
        await this.cardSetSyncService
          .sync((params as IQueryOrSyncParam<CardSetSyncOptions>).options)
          .then(() => console.log("end IpcSyncService.handling"));
        break;
      case "Card":
        await this.cardSyncService
          .sync((params as IQueryOrSyncParam<CardSyncOptions>).options)
          .then(() => console.log("end IpcSyncService.handling"));
        break;
      case "Catalog":
        await this.catalogSyncService
          .sync((params as IQueryOrSyncParam<CatalogSyncOptions>).options)
          .then(() => console.log("end IpcSyncService.handling"));
        break;
      // case "Ruling":
      //    this.rulingSyncService
      //      .sync((params as IQueryOrSyncParam<RulingQueryOrSyncOptions>).options)
      //      .then(() => console.log("end sync"));
      //    break;
      case "Symbology":
        await this.symbologySyncService
          .sync(undefined)
          .then(() => console.log("end IpcSyncService.handling"));
        break;
    }

  }
}
