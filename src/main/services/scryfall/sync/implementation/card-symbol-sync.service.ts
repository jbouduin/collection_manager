import { InsertResult, Selectable, Transaction, UpdateResult } from "kysely";
import { inject, injectable } from "tsyringe";
import { DtoSyncParam } from "../../../../../common/dto";
import { ProgressCallback } from "../../../../../common/ipc-params";
import { runSerial } from "../../../../../main/services/infra/util";
import { CardSymbolTable, DatabaseSchema } from "../../../../database/schema";
import { IConfigurationService, IDatabaseService, IImageCacheService, ILogService } from "../../../infra/interfaces";
import { INFRASTRUCTURE, SCRYFALL } from "../../../service.tokens";
import { ICardSymbolAdapter, ICardSymbolAlternativeAdapter, ICardSymbolColorMapAdapter } from "../../adapt/interface";
import { IScryfallClient } from "../../client/interfaces";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";
import { ICardSymbolSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";


@injectable()
export class CardSymbolSyncService extends BaseSyncService implements ICardSymbolSyncService {
  //#region private readonly fields -------------------------------------------
  private readonly imageCacheService: IImageCacheService;
  private readonly cardSymbolAdapter: ICardSymbolAdapter;
  private readonly cardSymbolAlternativeAdapter: ICardSymbolAlternativeAdapter;
  private readonly cardSymbolColorMapAdapter: ICardSymbolColorMapAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService,
    @inject(INFRASTRUCTURE.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(SCRYFALL.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(SCRYFALL.CardSymbolAdapter) cardSymbolAdapter: ICardSymbolAdapter,
    @inject(SCRYFALL.CardSymbolAlternativeAdapter) cardSymbolAlternativeAdapter: ICardSymbolAlternativeAdapter,
    @inject(SCRYFALL.CardSymbolColorMapAdapter) cardSymbolColorMapAdapter: ICardSymbolColorMapAdapter
  ) {
    super(databaseService, configurationService, logService, scryfallclient);
    this.imageCacheService = imageCacheService;
    this.cardSymbolAdapter = cardSymbolAdapter;
    this.cardSymbolAlternativeAdapter = cardSymbolAlternativeAdapter;
    this.cardSymbolColorMapAdapter = cardSymbolColorMapAdapter;
  }
  //#endregion

  //#region ICardSymbolSyncService methods ------------------------------------
  public override async sync(_syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void> {
    progressCallback("Synchronizing card symbols");
    return await this.scryfallclient.getCardSymbols(progressCallback)
      .then(async (all: Array<ScryfallCardSymbol>) => {
        this.dumpScryFallData("card-symbols.json", all);
        this.processSync(all);
      })
      .then(async () => await this.database
        .selectFrom("card_symbol")
        .selectAll()
        .execute())
      .then(async (allCardSymbols: Array<Selectable<CardSymbolTable>>) => {
        this.logService.debug("Main", `Saved ${allCardSymbols.length} card symbols`);
        progressCallback(`Saved ${allCardSymbols.length} card symbols`);
        let result = Promise.resolve();
        allCardSymbols.forEach(async (cardSymbol: Selectable<CardSymbolTable>) => {
          result = result.then(async () => await this.imageCacheService.cacheCardSymbolSvg(cardSymbol, progressCallback));
          await result;
        });
        return result;
      });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async processSync(symbols: Array<ScryfallCardSymbol>): Promise<void> {
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      await runSerial<ScryfallCardSymbol>(
        symbols,
        async (symbol: ScryfallCardSymbol, _idx: number, _total: number) => {
          const insertOrUpdate: Promise<InsertResult | UpdateResult> = super.genericSingleSync(
            trx,
            "card_symbol",
            (eb) => eb("card_symbol.id", "=", symbol.symbol),
            this.cardSymbolAdapter,
            symbol
          );

          return await insertOrUpdate
            .then(async () => {
              return symbol.colors?.length > 0
                ? await super.genericDeleteAndRecreate(
                  trx,
                  "card_symbol_color_map",
                  (eb) => eb("card_symbol_color_map.card_symbol_id", "=", symbol.symbol),
                  this.cardSymbolColorMapAdapter,
                  { cardSymbolId: symbol.symbol, colorIds: symbol.colors }
                )
                : Promise.resolve();
            })
            .then(async () => {
              return symbol.gatherer_alternates?.length > 0
                ? await super.genericDeleteAndRecreate(
                  trx,
                  "card_symbol_alternative",
                  (eb) => eb("card_symbol_alternative.card_symbol_id", "=", symbol.symbol),
                  this.cardSymbolAlternativeAdapter,
                  { cardSymbolId: symbol.symbol, alternatives: symbol.gatherer_alternates }
                )
                : Promise.resolve();
            })
            .then(() => Promise.resolve());
        }
      );
    });
  }
  //#endregion
}
