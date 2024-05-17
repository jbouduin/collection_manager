// import { Symbology as ScryfallSymbology } from "scryfall-sdk";
import { CardSymbol, Color as ScryfallColor, Symbology as ScryfallSymbology } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult } from "kysely";
import { ProgressCallback } from "../../../../../common/ipc-params";
import { DatabaseSchema, Symbology } from "../../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService, IImageCacheService } from "../../../infra/interfaces";
import ADAPTTOKENS, { ISymbologyAdapter, ISymbologyAlternativeAdapter, ISymbologyColorMapAdapter } from "../../adapt/interface";
import { ISymbologySyncService } from "../interface/symbology-sync.service";
import { BaseSyncService } from "./base-sync.service";

@injectable()
export class SymbologySyncService extends BaseSyncService implements ISymbologySyncService {

  //#region Private readonly fields -------------------------------------------
  private readonly imageCacheService: IImageCacheService;
  private readonly symbologyAdapter: ISymbologyAdapter;
  private readonly symbologyAlternativeAdapter: ISymbologyAlternativeAdapter;
  private readonly symbologyColorMapAdapter: ISymbologyColorMapAdapter;
  //#endregion


  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(ADAPTTOKENS.SymbologyAdapter) symbologyAdapter: ISymbologyAdapter,
    @inject(ADAPTTOKENS.SymbologyAlternativeAdapter) symbologyAlternativeAdapter: ISymbologyAlternativeAdapter,
    @inject(ADAPTTOKENS.SymbologyColorMapAdapter) symbologyColorMapAdapter: ISymbologyColorMapAdapter) {
    super(databaseService);
    this.imageCacheService = imageCacheService;
    this.symbologyAdapter = symbologyAdapter;
    this.symbologyAlternativeAdapter = symbologyAlternativeAdapter;
    this.symbologyColorMapAdapter = symbologyColorMapAdapter;
  }

  public async sync(_options: null, progressCallback?: ProgressCallback): Promise<void> {
    console.log("start SymbologySyncService.sync");
    if (progressCallback) {
      progressCallback("Synchronizing card symbols");
    }
    return ScryfallSymbology.all()
      .then((all: Array<CardSymbol>) => this.processSync(all, progressCallback))
      .then(() => this.database.selectFrom("symbology").selectAll().execute()
        .then(async (allCardSymbols: Array<Symbology>) => {
          let result = Promise.resolve();
          allCardSymbols.forEach(async (cardSymbol: Symbology) => {
            result = result.then(() => this.imageCacheService.cacheCardSymbolSvg(cardSymbol));
          });
        })
      );
  }

  // TODO remove items that are not on the server anymore or at least mark them
  public async processSync(symbols: Array<CardSymbol>, progressCallback: ProgressCallback): Promise<void> {
    const total: number = symbols.length;
    if (progressCallback) {
      progressCallback(`Retrieved ${total} card symbols`);
    }
    // TODO because this one large transaction, the splash screen seems not to be updating until the commit at the end
    let cnt = 0;
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      symbols.forEach(async (symbol: CardSymbol) => {
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

  private async syncColors(trx: Transaction<DatabaseSchema>, symbol: string, colors: Array<ScryfallColor>): Promise<void> {
    colors.forEach(async (color: ScryfallColor) => {
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
    alternatives.forEach(async (alternative: ScryfallColor) => {
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

}
