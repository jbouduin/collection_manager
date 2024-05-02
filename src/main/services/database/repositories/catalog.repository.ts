import { Kysely, Transaction, sql } from "kysely";
import { inject, injectable } from "tsyringe";
import { ECatalogType } from "../../../../common/enums";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { NewCatalogItem } from "../schema/catalog-item.table";
import { NewCatalog } from "../schema/catalog.table";
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

  // TODO remove items that are not on the server anymore
  public async sync(name: ECatalogType, items: Array<string>): Promise<void> {
    const newCatalog: NewCatalog = {
      name
    }
    console.log('insert:', name)
    console.log(items)
    await this.database.transaction().execute(async (trx) => {
      let parentId = await trx.insertInto('catalog')
        .values(newCatalog)
        .onConflict((oc) => oc.column('name').doUpdateSet({ last_synced_at: sql`CURRENT_TIMESTAMP` }))
        .executeTakeFirst()
        .then((result) => result.insertId);
      if (parentId == BigInt(0)) { // it is an update
        parentId = (await trx.selectFrom('catalog').select('catalog.id').where('catalog.name', '=', name).executeTakeFirst()).id;
      }
      console.log(parentId)
      await this.syncCatalogItems(trx, name, items);
    });
  }

  private async syncCatalogItems(trx: Transaction<DatabaseSchema>, catalog: ECatalogType, items: Array<string>): Promise<void> {
    items.forEach(async (item: string) => {
      const parent = await trx.selectFrom('catalog').select('catalog.id').where("catalog.name", "=", catalog).executeTakeFirst();
      const newItem: NewCatalogItem = {
        name: item,
        catalog_id: parent.id
      }

      await trx.insertInto('catalog_item')
        .values(newItem)
        .onConflict((oc) => oc.columns(['catalog_id', 'name']).doUpdateSet({ last_synced_at: sql`CURRENT_TIMESTAMP` }))
        .executeTakeFirst()
    });

  }
}
