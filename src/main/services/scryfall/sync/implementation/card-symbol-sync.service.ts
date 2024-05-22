import { inject, injectable } from "tsyringe";

import { ExpressionOrFactory, InsertResult, Selectable, SqlBool, Transaction, UpdateResult } from "kysely";
import { MTGColor } from "../../../../../common/enums";
import { CardSymbolSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { CardSymbolTable, DatabaseSchema } from "../../../../database/schema";
import INFRATOKENS, { IConfigurationService, IDatabaseService, IImageCacheService } from "../../../infra/interfaces";
import ADAPTTOKENS, { ICardSymbolAdapter, ICardSymbolAlternativeAdapter, ICardSymbolColorMapAdapter } from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";
import { ICardSymbolSyncService } from "../interface/card-symbol-sync.service";
import { BaseSyncService } from "./base-sync.service";
import { runSerial } from "../../../../../main/services/infra/util";


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
  public override async sync(options: CardSymbolSyncOptions, progressCallback: ProgressCallback): Promise<void> {
    return await this.shouldSync(options)
      .then(async (shouldSync: boolean) => {
        if (shouldSync) {
          console.log("start CardSymbolSyncService.sync");
          if (progressCallback) {
            progressCallback("Synchronizing card symbols");
          }
          return await this.scryfallclient.getCardSymbols()
            .then(async (all: Array<ScryfallCardSymbol>) => this.processSync(all, progressCallback))
            .then(async () => await this.database.selectFrom("card_symbol").selectAll().execute())
            .then(async (allCardSymbols: Array<Selectable<CardSymbolTable>>) => {
              console.log((`retrieved ${allCardSymbols.length} saved card symbols`));
              let result = Promise.resolve();
              allCardSymbols.forEach(async (cardSymbol: Selectable<CardSymbolTable>) => {
                result = result.then(async () => await this.imageCacheService.cacheCardSymbolSvg(cardSymbol));
                await result;
              });
              return result;
            });
        } else {
          console.log("skip CardSymbolSyncService.sync");
          return Promise.resolve();
        }
      });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async processSync(symbols: Array<ScryfallCardSymbol>, progressCallback: ProgressCallback): Promise<void> {
    // NOW refactor sync service after making child tables non synchronized
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      await runSerial<ScryfallCardSymbol>(symbols, async (symbol: ScryfallCardSymbol, idx: number, total: number) => {
        if (progressCallback) {
          progressCallback(`Synchronizing ${symbol.symbol} ${idx + 1}/${total}`);
        }
        const existing = await trx.selectFrom("card_symbol")
          .select("card_symbol.id")
          .where("card_symbol.id", "=", symbol.symbol)
          .executeTakeFirst();

        let insertOrUpdate: Promise<InsertResult | UpdateResult>;
        if (existing) {
          insertOrUpdate = trx.updateTable("card_symbol")
            .set(this.cardSymbolAdapter.toUpdate(symbol))
            .where("card_symbol.id", "=", symbol.symbol)
            .executeTakeFirstOrThrow();
        } else {
          insertOrUpdate = trx.insertInto("card_symbol")
            .values(this.cardSymbolAdapter.toInsert(symbol))
            .executeTakeFirstOrThrow();
        }

        await insertOrUpdate.then(async () => {
          if (symbol.colors.length > 0) {
            await this.syncColors(trx, symbol.symbol, symbol.colors);
          }
          if (symbol.gatherer_alternates?.length > 0) {
            await this.syncAlternatives(trx, symbol.symbol, symbol.gatherer_alternates);
          }
        });
      });
    });

  }

  private async syncColors(trx: Transaction<DatabaseSchema>, symbol: string, colors: Array<MTGColor>): Promise<void> {
    colors.forEach(async (color: MTGColor) => {
      const filter: ExpressionOrFactory<DatabaseSchema, "card_symbol_color_map", SqlBool> = (eb) =>
        eb.and([
          eb("card_symbol_color_map.color_id", "=", color),
          eb("card_symbol_color_map.card_symbol_id", "=", symbol)
        ]
        );
      const existing = await trx.selectFrom("card_symbol_color_map")
        .select("card_symbol_color_map.color_id")
        .where(filter)
        .executeTakeFirst();
      if (existing) {
        await trx.updateTable("card_symbol_color_map")
          .set(this.cardSymbolColorMapAdapter.toUpdate(null))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("card_symbol_color_map")
          .values(this.cardSymbolColorMapAdapter.toInsert({ card_symbol_id: symbol, color_id: color }))
          .executeTakeFirstOrThrow();
      }
    });
  }

  private async syncAlternatives(trx: Transaction<DatabaseSchema>, symbol: string, alternatives: Array<string>): Promise<void> {
    alternatives.forEach(async (alternative: string) => {
      const filter: ExpressionOrFactory<DatabaseSchema, "card_symbol_alternative", SqlBool> = (eb) =>
        eb.and([
          eb("card_symbol_alternative.card_symbol_id", "=", symbol),
          eb("card_symbol_alternative.alternative", "=", alternative)
        ]
        );
      const existing = await trx.selectFrom("card_symbol_alternative")
        .select("card_symbol_alternative.alternative")
        .where(filter)
        .executeTakeFirst();

      if (existing) {
        await trx.updateTable("card_symbol_alternative")
          .set(this.cardSymbolAlternativeAdapter.toUpdate(null))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("card_symbol_alternative")
          .values(this.cardSymbolAlternativeAdapter.toInsert({ cardSymbolId: symbol, alternative: alternative }))
          .executeTakeFirstOrThrow();
      }
    });
  }

  private async shouldSync(options: CardSymbolSyncOptions): Promise<boolean> {
    if (options.source == "user" || this.configurationService.syncAtStartup.indexOf("CardSymbol") >= 0) {
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
