import { inject, injectable } from "tsyringe";

import { ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult } from "kysely";
import { MTGColor } from "../../../../../common/enums";
import { CardSymbolSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { DatabaseSchema, Symbology } from "../../../../database/schema";
import INFRATOKENS, { IConfigurationService, IDatabaseService, IImageCacheService } from "../../../infra/interfaces";
import ADAPTTOKENS, { ISymbologyAdapter, ISymbologyAlternativeAdapter, ISymbologyColorMapAdapter } from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";
import { ICardSymbolSyncService } from "../interface/card-symbol-sync.service";
import { BaseSyncService } from "./base-sync.service";


@injectable()
export class CardSymbolSyncService extends BaseSyncService<CardSymbolSyncOptions> implements ICardSymbolSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly configurationService: IConfigurationService;
  private readonly imageCacheService: IImageCacheService;
  private readonly symbologyAdapter: ISymbologyAdapter;
  private readonly symbologyAlternativeAdapter: ISymbologyAlternativeAdapter;
  private readonly symbologyColorMapAdapter: ISymbologyColorMapAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(ADAPTTOKENS.SymbologyAdapter) symbologyAdapter: ISymbologyAdapter,
    @inject(ADAPTTOKENS.SymbologyAlternativeAdapter) symbologyAlternativeAdapter: ISymbologyAlternativeAdapter,
    @inject(ADAPTTOKENS.SymbologyColorMapAdapter) symbologyColorMapAdapter: ISymbologyColorMapAdapter) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.configurationService = configurationService;
    this.imageCacheService = imageCacheService;
    this.symbologyAdapter = symbologyAdapter;
    this.symbologyAlternativeAdapter = symbologyAlternativeAdapter;
    this.symbologyColorMapAdapter = symbologyColorMapAdapter;
  }
  //#endregion

  //#region ICardSymbolSyncService methods ------------------------------------
  public override async sync(options: CardSymbolSyncOptions, progressCallback: ProgressCallback): Promise<void> {
    return await this.shouldSync(options)
      .then(async (shouldSync: boolean) => {
        if (shouldSync) {
          console.log("start SymbologySyncService.sync");
          if (progressCallback) {
            progressCallback("Synchronizing card symbols");
          }
          return this.scryfallclient.getCardSymbols()
            .then((all: Array<ScryfallCardSymbol>) => this.processSync(all, progressCallback))
            .then(() => this.database.selectFrom("symbology").selectAll().execute()
              .then(async (allCardSymbols: Array<Symbology>) => {
                let result = Promise.resolve();
                allCardSymbols.forEach(async (cardSymbol: Symbology) => {
                  result = result.then(() => this.imageCacheService.cacheCardSymbolSvg(cardSymbol));
                });
              })
            );
        } else {
          console.log("skip SymbologySyncService.sync");
        }
      });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  // TODO remove items that are not on the server anymore or at least mark them
  private async processSync(symbols: Array<ScryfallCardSymbol>, progressCallback: ProgressCallback): Promise<void> {
    const total: number = symbols.length;
    if (progressCallback) {
      progressCallback(`Retrieved ${total} card symbols`);
    }
    // TODO because this one large transaction, the splash screen seems not to be updating until the commit at the end
    let cnt = 0;
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      symbols.forEach(async (symbol: ScryfallCardSymbol) => {
        cnt++;
        if (progressCallback) {
          progressCallback(`Synchronizing ${symbol.symbol} ${cnt}/${total}`);
        }
        const existing = trx.selectFrom("symbology")
          .select("symbology.id")
          .where("symbology.id", "=", symbol.symbol)
          .executeTakeFirst();
        existing.then((existing: { id: string }) => {
          let insertOrUpdate: Promise<InsertResult | UpdateResult>;
          if (existing) {
            insertOrUpdate = trx.updateTable("symbology")
              .set(this.symbologyAdapter.toUpdate(symbol))
              .where("symbology.id", "=", symbol.symbol)
              .executeTakeFirstOrThrow();
          } else {
            insertOrUpdate = trx.insertInto("symbology")
              .values(this.symbologyAdapter.toInsert(symbol))
              .executeTakeFirstOrThrow();
          }

          insertOrUpdate.then(() => {
            if (symbol.colors.length > 0) {
              this.syncColors(trx, symbol.symbol, symbol.colors);
            } // TODO else remove existing
            if (symbol.gatherer_alternates?.length > 0) {
              this.syncAlternatives(trx, symbol.symbol, symbol.gatherer_alternates);
            } // TODO else remove existing
          });
        });
      });
    });
  }

  private async syncColors(trx: Transaction<DatabaseSchema>, symbol: string, colors: Array<MTGColor>): Promise<void> {
    colors.forEach(async (color: MTGColor) => {
      const filter: ExpressionOrFactory<DatabaseSchema, "symbology_color_map", SqlBool> = (eb) =>
        eb.and([
          eb("symbology_color_map.color_id", "=", color),
          eb("symbology_color_map.symbology_id", "=", symbol)
        ]
        );
      const existing = await trx.selectFrom("symbology_color_map")
        .select("symbology_color_map.color_id")
        .where(filter)
        .executeTakeFirst();
      if (existing) {
        await trx.updateTable("symbology_color_map")
          .set(this.symbologyColorMapAdapter.toUpdate(null))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("symbology_color_map")
          .values(this.symbologyColorMapAdapter.toInsert(symbol, color, null))
          .executeTakeFirstOrThrow();
      }
    });
  }

  private async syncAlternatives(trx: Transaction<DatabaseSchema>, symbol: string, alternatives: Array<string>): Promise<void> {
    alternatives.forEach(async (alternative: string) => {
      const filter: ExpressionOrFactory<DatabaseSchema, "symbology_alternative", SqlBool> = (eb) =>
        eb.and([
          eb("symbology_alternative.symbology_id", "=", symbol),
          eb("symbology_alternative.alternative", "=", alternative)
        ]
        );
      const existing = await trx.selectFrom("symbology_alternative")
        .select("symbology_alternative.alternative")
        .where(filter)
        .executeTakeFirst();

      if (existing) {
        await trx.updateTable("symbology_alternative")
          .set(this.symbologyAlternativeAdapter.toUpdate(null))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("symbology_alternative")
          .values(this.symbologyAlternativeAdapter.toInsert(symbol, alternative))
          .executeTakeFirstOrThrow();
      }
    });
  }

  private async shouldSync(options: CardSymbolSyncOptions): Promise<boolean> {
    if (options.source == "user" || this.configurationService.syncAtStartup.indexOf("CardSymbol") >= 0) {
      return Promise.resolve(true);
    } else {
      return await this.database
        .selectFrom("symbology")
        .selectAll()
        .limit(1)
        .executeTakeFirst()
        .then((existing: Symbology) => existing ? false : true);
    }
  }
  //#endregion
}