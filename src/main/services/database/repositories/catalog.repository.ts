import { Transaction, sql } from "kysely";
import { inject, injectable } from "tsyringe";
import { v1 as uuidV1 } from "uuid";
import { ECatalogType } from "../../../../common/enums";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { DatabaseSchema } from "../schema/database.schema";
import { BaseRepository } from "./base.repository";

export interface ICatalogRepository {
  sync(name: ECatalogType, items: Array<string>): Promise<void>;
}

@injectable()
export class CatalogRepository extends BaseRepository implements ICatalogRepository {


  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  public async sync(name: ECatalogType, items: Array<string>): Promise<void> {


    console.log('insert:', name)

    await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      const existingCatalog = await trx
        .selectFrom('catalog')
        .select("catalog.id")
        .where("catalog.name", "=", name)
        .executeTakeFirst();
      let catalogId: string = null;
      if (existingCatalog) {
        console.log("catalog exists", name);
        catalogId = existingCatalog.id;
        trx.updateTable('catalog')
          .set({ last_synced_at: sql`CURRENT_TIMESTAMP` })
          .where("catalog.id", "=", existingCatalog.id)
          .executeTakeFirstOrThrow()
          .catch((reason) => console.log(reason));
      } else {
        console.log("catalog does not exists", name);
        catalogId = uuidV1();
        await trx.insertInto('catalog')
          .values({ name: name, id: catalogId })
          .executeTakeFirstOrThrow()
          .catch((reason) => console.log(reason));
      }
      await this.syncCatalogItems(trx, catalogId, items);
    });
  }

  // TODO remove items that are not on the server anymore or at least mark them
  private async syncCatalogItems(trx: Transaction<DatabaseSchema>, catalogId: string, items: Array<string>): Promise<void> {
    items.forEach(async (item: string) => {
      const existingItem = await trx
        .selectFrom('catalog_item')
        .select("catalog_item.id")
        .where("catalog_item.catalog_id", "=", catalogId)
        .where("catalog_item.name", "=", item)
        .executeTakeFirst();
      console.log()
      if (existingItem) {
        await trx.updateTable("catalog_item")
          .set({ last_synced_at: sql`CURRENT_TIMESTAMP` })
          .where("catalog_item.id", "=", existingItem.id)
          .executeTakeFirstOrThrow()
          .catch((reason) => console.log(reason));
      } else {
        await trx.insertInto('catalog_item')
          .values({ id: uuidV1(), name: item, catalog_id: catalogId })
          .executeTakeFirstOrThrow()
          .catch((reason) => console.log(reason));
      }
    });
  }
}
