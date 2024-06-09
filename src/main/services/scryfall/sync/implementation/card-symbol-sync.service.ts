import { InsertResult, Selectable, Transaction, UpdateResult } from "kysely";
import { inject, injectable } from "tsyringe";

import { CardSymbolSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { runSerial } from "../../../../../main/services/infra/util";
import { CardSymbolTable, DatabaseSchema } from "../../../../database/schema";
import INFRATOKENS, { IConfigurationService, IDatabaseService, IImageCacheService } from "../../../infra/interfaces";
import ADAPTTOKENS, { ICardSymbolAdapter, ICardSymbolAlternativeAdapter, ICardSymbolColorMapAdapter } from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";
import { ICardSymbolSyncService } from "../interface/card-symbol-sync.service";
import { BaseSyncService } from "./base-sync.service";
import { DtoSyncParam, SyncSource } from "../../../../../common/dto";


@injectable()
export class CardSymbolSyncService extends BaseSyncService<CardSymbolSyncOptions> implements ICardSymbolSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly configurationService: IConfigurationService;
  private readonly imageCacheService: IImageCacheService;
  private readonly cardSymbolAdapter: ICardSymbolAdapter;
  private readonly cardSymbolAlternativeAdapter: ICardSymbolAlternativeAdapter;
  private readonly cardSymbolColorMapAdapter: ICardSymbolColorMapAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(ADAPTTOKENS.CardSymbolAdapter) cardSymbolAdapter: ICardSymbolAdapter,
    @inject(ADAPTTOKENS.CardSymbolAlternativeAdapter) cardSymbolAlternativeAdapter: ICardSymbolAlternativeAdapter,
    @inject(ADAPTTOKENS.CardSymbolColorMapAdapter) cardSymbolColorMapAdapter: ICardSymbolColorMapAdapter) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.configurationService = configurationService;
    this.imageCacheService = imageCacheService;
    this.cardSymbolAdapter = cardSymbolAdapter;
    this.cardSymbolAlternativeAdapter = cardSymbolAlternativeAdapter;
    this.cardSymbolColorMapAdapter = cardSymbolColorMapAdapter;
  }
  //#endregion

  //#region ICardSymbolSyncService methods ------------------------------------
  public override async newSync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void> {
    return await this.shouldSync(syncParam.syncRequestSource)
      .then(async (shouldSync: boolean) => {
        if (shouldSync) {
          console.log("start CardSymbolSyncService.sync");
          if (progressCallback) {
            progressCallback("Synchronizing card symbols");
          }
          return await this.scryfallclient.getCardSymbols(progressCallback)
            .then(async (all: Array<ScryfallCardSymbol>) => this.processSync(all))
            .then(async () => await this.database.selectFrom("card_symbol").selectAll().execute())
            .then(async (allCardSymbols: Array<Selectable<CardSymbolTable>>) => {
              console.log((`Saved ${allCardSymbols.length} card symbols`));
              progressCallback(`Saved ${allCardSymbols.length} card symbols`);
              let result = Promise.resolve();
              allCardSymbols.forEach(async (cardSymbol: Selectable<CardSymbolTable>) => {
                result = result.then(async () => await this.imageCacheService.cacheCardSymbolSvg(cardSymbol, progressCallback));
                await result;
              });
              return result;
            });
        } else {
          console.log("skip CardSymbolSyncService.sync");
          if (progressCallback) {
            progressCallback("Skip synchronizaton of card symbols");
          }
          return Promise.resolve();
        }
      });
  }

  public override async sync(options: CardSymbolSyncOptions, progressCallback: ProgressCallback): Promise<void> {
    return await this.shouldSync(options.source)
      .then(async (shouldSync: boolean) => {
        if (shouldSync) {
          console.log("start CardSymbolSyncService.sync");
          if (progressCallback) {
            progressCallback("Synchronizing card symbols");
          }
          return await this.scryfallclient.getCardSymbols(progressCallback)
            .then(async (all: Array<ScryfallCardSymbol>) => this.processSync(all))
            .then(async () => await this.database.selectFrom("card_symbol").selectAll().execute())
            .then(async (allCardSymbols: Array<Selectable<CardSymbolTable>>) => {
              console.log((`retrieved ${allCardSymbols.length} saved card symbols`));
              let result = Promise.resolve();
              allCardSymbols.forEach(async (cardSymbol: Selectable<CardSymbolTable>) => {
                result = result.then(async () => await this.imageCacheService.cacheCardSymbolSvg(cardSymbol, progressCallback));
                await result;
              });
              return result;
            });
        } else {
          console.log("skip CardSymbolSyncService.sync");
          if (progressCallback) {
            progressCallback("Skip synchronizaton of card symbols");
          }
          return Promise.resolve();
        }
      });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async processSync(symbols: Array<ScryfallCardSymbol>): Promise<void> {
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      await runSerial<ScryfallCardSymbol>(
        symbols,
        (symbol: ScryfallCardSymbol) => `Processing '${symbol.symbol}'`,
        async (symbol: ScryfallCardSymbol, _idx: number, _total: number) => {
          const insertOrUpdate: Promise<InsertResult | UpdateResult> = super.genericSingleSync(
            trx,
            "card_symbol",
            (eb) => eb("card_symbol.id", "=", symbol.symbol),
            this.cardSymbolAdapter,
            symbol
          );

          return await insertOrUpdate
            .then(async () => symbol.colors?.length > 0 ?
              await super.genericDeleteAndRecreate(
                trx,
                "card_symbol_color_map",
                (eb) => eb("card_symbol_color_map.card_symbol_id", "=", symbol.symbol),
                this.cardSymbolColorMapAdapter,
                { cardSymbolId: symbol.symbol, colorIds: symbol.colors }
              ) :
              Promise.resolve()
            )
            .then(async () => symbol.gatherer_alternates?.length > 0 ?
              await super.genericDeleteAndRecreate(
                trx,
                "card_symbol_alternative",
                (eb) => eb("card_symbol_alternative.card_symbol_id", "=", symbol.symbol),
                this.cardSymbolAlternativeAdapter,
                { cardSymbolId: symbol.symbol, alternatives: symbol.gatherer_alternates }
              ) :
              Promise.resolve()
            )
            .then(() => Promise.resolve());
        });
    });
  }

  private async shouldSync(source: SyncSource): Promise<boolean> {
    if (source == "user" || this.configurationService.syncAtStartup.indexOf("CardSymbol") >= 0) {
      return Promise.resolve(true);
    } else {
      return await this.database
        .selectFrom("card_symbol")
        .selectAll()
        .limit(1)
        .executeTakeFirst()
        .then((existing: Selectable<CardSymbolTable>) => existing ? false : true);
    }
  }
  //#endregion
}
