import { ExpressionOrFactory, InsertResult, SqlBool, Transaction, UpdateResult } from "kysely";
import { CardSymbol, Color as ScryfallColor } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { SymbologySelectDto } from "../../../../common/dto";
import { DatabaseSchema, Symbology, SymbologyAlternative, SymbologyColorMap } from "../../../database/schema";
import ADAPTTOKENS, { ISymbologyAdapter, ISymbologyAlternativeAdapter, ISymbologyColorMapAdapter } from "../../adapt/interfaces";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ISymbologyRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class SymbologyRepository extends BaseRepository implements ISymbologyRepository {

  private symbologyAdapter: ISymbologyAdapter;
  private symbologyAlternativeAdapter: ISymbologyAlternativeAdapter;
  private symbologyColorMapAdapter: ISymbologyColorMapAdapter;

  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.SymbologyAdapter) symbologyAdapter: ISymbologyAdapter,
    @inject(ADAPTTOKENS.SymbologyAlternativeAdapter) symbologyAlternativeAdapter: ISymbologyAlternativeAdapter,
    @inject(ADAPTTOKENS.SymbologyColorMapAdapter) symbologyColorMapAdapter: ISymbologyColorMapAdapter) {
    super(databaseService);
    this.symbologyAdapter = symbologyAdapter;
    this.symbologyAlternativeAdapter = symbologyAlternativeAdapter;
    this.symbologyColorMapAdapter = symbologyColorMapAdapter;
  }

  public async getAll(): Promise<Array<SymbologySelectDto>> {

    const allSymbologies = await this.database.selectFrom("symbology").selectAll().execute();
    const allColors = await this.database.selectFrom("symbology_color_map").selectAll().execute();
    const allAlternatives = await this.database.selectFrom("symbology_alternative").selectAll().execute();
    const result = allSymbologies.map<SymbologySelectDto>((symbol: Symbology) => {
      return {
        symbology: symbol,
        colors: allColors.filter((color: SymbologyColorMap) => color.symbology_id == symbol.id),
        alternatives: allAlternatives.filter((alternative: SymbologyAlternative) => alternative.symbology_id == symbol.id),
      };
    });
    return result;
  }

  // TODO remove items that are not on the server anymore or at least mark them
  public async sync(symbols: Array<CardSymbol>): Promise<void> {
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      symbols.forEach(async (symbol: CardSymbol) => {
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
    // TODO use map and waitforall
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
