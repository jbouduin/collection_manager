import { Transaction, sql } from "kysely";
import { inject, injectable } from "tsyringe";
import { v1 as uuidV1 } from "uuid";
import { CatalogType } from "../../../../common/enums";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { DatabaseSchema } from "../schema/database.schema";
import { BaseRepository } from "./base.repository";

export interface ICatalogRepository {
  sync(name: CatalogType, items: Array<string>): Promise<void>;
}

@injectable()
export class CatalogRepository extends BaseRepository implements ICatalogRepository {


  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  // TODO remove items that are not on the server anymore or at least mark them
  public async sync(catalogType: CatalogType, items: Array<string>): Promise<void> {
      await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      items.forEach(async (item: string) => {
        const existingItem = await trx
          .selectFrom("catalog_item")
          .select("catalog_item.id")
          .where("catalog_item.catalog_name", "=", catalogType)
          .where("catalog_item.item", "=", item)
          .executeTakeFirst();

        if (existingItem) {
          await trx.updateTable("catalog_item")
            .set({ last_synced_at: sql`CURRENT_TIMESTAMP` })
            .where("catalog_item.catalog_name", "=", catalogType)
            .where("catalog_item.item", "=", item)
            .executeTakeFirstOrThrow()
            .catch((reason) => console.log(reason));
        } else {
          await trx.insertInto("catalog_item")
            .values({ id: uuidV1(), catalog_name: catalogType, item: item })
            .executeTakeFirstOrThrow()
            .catch((reason) => { console.log(reason); throw new Error("insert failed"); });
        }
      });
    });
  }
}
