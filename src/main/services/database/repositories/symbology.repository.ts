import { inject, injectable } from "tsyringe";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { BaseRepository } from "./base.repository";
import { Color as ScryfallColor, CardSymbol } from "scryfall-sdk";
import { Symbology } from "../schema/symbology.table";
import { DatabaseSchema } from "../schema/database.schema";
import { Transaction, sql } from "kysely";
import { SymbologySelectDto } from "../../../../common/dto/select/symbology-select.dto";
import { SymbologyColorMap } from "../schema/symbology-color.map";
import { SymbologyAlternative } from "../schema/symbology-alternative.table";



export interface ISymbologyRepository {
  getAll(): Promise<Array<SymbologySelectDto>>;
  sync(symbols: Array<CardSymbol>): Promise<void>
}

@injectable()
export class SymbologyRepository extends BaseRepository implements ISymbologyRepository {

  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
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
    await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      symbols.forEach(async (symbol: CardSymbol) => {
        const existing = await trx.selectFrom("symbology")
          .select("symbology.id")
          .where("symbology.id", "=", symbol.symbol)
          .executeTakeFirst();
        if (existing) {
          await trx.updateTable("symbology")
            .set({
              appears_in_mana_costs: symbol.appears_in_mana_costs ? 1 : 0,
              cmc: symbol.mana_value,
              english: symbol.english,
              funny: symbol.funny ? 1 : 0,
              hybrid: 0, // TODO scrfall-sdk is not returning this
              last_synced_at: sql`CURRENT_TIMESTAMP`,
              loose_variant: symbol.loose_variant,
              mana_value: symbol.mana_value,
              phyrexian: 0, // TODO scrfall-sdk is not returning this
              represents_mana: symbol.represents_mana ? 1 : 0,
              svg_uri: symbol.svg_uri,
              transposable: symbol.transposable ? 1 : 0
            })
            .where("symbology.id", "=", symbol.symbol)
            .executeTakeFirstOrThrow();
        } else {
          await trx.insertInto("symbology")
            .values({
              id: symbol.symbol,
              appears_in_mana_costs: symbol.appears_in_mana_costs ? 1 : 0,
              cmc: symbol.mana_value,
              english: symbol.english,
              funny: symbol.funny ? 1 : 0,
              hybrid: 0, // TODO scrfall-sdk is not returning this
              loose_variant: symbol.loose_variant,
              mana_value: symbol.mana_value,
              phyrexian: 0, // TODO scrfall-sdk is not returning this
              represents_mana: symbol.represents_mana ? 1 : 0,
              svg_uri: symbol.svg_uri,
              transposable: symbol.transposable ? 1 : 0
            })
            .executeTakeFirstOrThrow();
        }
        if (symbol.colors.length > 0) {
          await this.syncColors(trx, symbol.symbol, symbol.colors);
        } // TODO else remove existing
        if (symbol.gatherer_alternates?.length > 0) {
          await this.syncAlternatives(trx, symbol.symbol, symbol.gatherer_alternates);
        } // TODO else remove existing
      });
    });
    return Promise.resolve();
  }

  private async syncColors(trx: Transaction<DatabaseSchema>, symbol: string, colors: Array<ScryfallColor>): Promise<void> {
    // TODO use map and waitforall
    colors.forEach(async (color: ScryfallColor) => {
      const existing = await trx.selectFrom("symbology_color_map")
        .select("symbology_color_map.color_id")
        .where("symbology_color_map.color_id", "=", color)
        .where("symbology_color_map.symbology_id", "=", symbol)
        .executeTakeFirst();
      if (existing) {
        await trx.updateTable("symbology_color_map")
          .set({ last_synced_at: sql`CURRENT_TIMESTAMP` })
          .where("symbology_color_map.color_id", "=", color)
          .where("symbology_color_map.symbology_id", "=", symbol)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("symbology_color_map")
          .values({ color_id: color, symbology_id: symbol })
          .executeTakeFirstOrThrow();
      }
    });
  }

  private async syncAlternatives(trx: Transaction<DatabaseSchema>, symbol: string, alternatives: Array<string>): Promise<void> {
    alternatives.forEach(async (alternative: ScryfallColor) => {
      const existing = await trx.selectFrom("symbology_alternative")
        .select("symbology_alternative.alternative")
        .where("symbology_alternative.symbology_id", "=", symbol)
        .where("symbology_alternative.alternative", "=", alternative)
        .executeTakeFirst();
      if (existing) {
        await trx.updateTable("symbology_alternative")
          .set({ last_synced_at: sql`CURRENT_TIMESTAMP` })
          .where("symbology_alternative.alternative", "=", alternative)
          .where("symbology_alternative.symbology_id", "=", symbol)
          .executeTakeFirstOrThrow();
      } else {
        await trx.insertInto("symbology_alternative")
          .values({ alternative: alternative, symbology_id: symbol })
          .executeTakeFirstOrThrow();
      }
    });
  }
}
