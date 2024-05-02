import { Transaction, sql } from "kysely";
import { Set as ScryfallSet } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { DatabaseSchema } from "../schema/database.schema";
import { BaseRepository } from "./base.repository";

export interface ICardSetRepository {
  sync(cardSets: Array<ScryfallSet>): Promise<void>;
}

@injectable()
export class CardSetRepository extends BaseRepository implements ICardSetRepository {

  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  // TODO remove items that are not on the server anymore
  public async sync(cardSets: ScryfallSet[]): Promise<void> {
    await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      cardSets.forEach(async (cardSet: ScryfallSet) => {
        await trx.insertInto('card_set')
          .values({
            arena_code: cardSet.arena_code,
            block: cardSet.block,
            block_code: cardSet.block_code,
            card_count: cardSet.card_count,
            code: cardSet.code,
            digital: cardSet.digital ? 1 : 0,
            foil_only: cardSet.foil_only ? 1 : 0,
            icon_svg_uri: cardSet.icon_svg_uri,
            mtgo_code: cardSet.mtgo_code,
            name: cardSet.name,
            nonfoil_only: cardSet.nonfoil_only ? 1 : 0,
            parent_set_code: cardSet.parent_set_code,
            printed_size: cardSet.printed_size,
            scryfall_id: cardSet.id,
            released_at: cardSet.released_at,
            scryfall_uri: cardSet.scryfall_uri,
            search_uri: cardSet.search_uri,
            set_type: cardSet.set_type,
            tcgplayer_id: cardSet.tcgplayer_id,
            uri: cardSet.uri
          })
          .onConflict((oc) => oc.column('scryfall_id').doUpdateSet({
            arena_code: cardSet.arena_code,
            block: cardSet.block,
            block_code: cardSet.block_code,
            card_count: cardSet.card_count,
            code: cardSet.code,
            digital: cardSet.digital ? 1 : 0,
            foil_only: cardSet.foil_only ? 1 : 0,
            icon_svg_uri: cardSet.icon_svg_uri,
            mtgo_code: cardSet.mtgo_code,
            name: cardSet.name,
            nonfoil_only: cardSet.nonfoil_only ? 1 : 0,
            parent_set_code: cardSet.parent_set_code,
            printed_size: cardSet.printed_size,
            // scryfall_id: cardSet.id,
            released_at: cardSet.released_at,
            scryfall_uri: cardSet.scryfall_uri,
            search_uri: cardSet.search_uri,
            set_type: cardSet.set_type,
            tcgplayer_id: cardSet.tcgplayer_id,
            uri: cardSet.uri,
            last_synced_at: sql`CURRENT_TIMESTAMP`
          }))
          .executeTakeFirst()
          .then((result) => result.insertId);
      });
    });
  }
}
