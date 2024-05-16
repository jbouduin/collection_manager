import { Transaction } from "kysely";
import { inject, injectable } from "tsyringe";

import { CatalogType } from "../../../../common/enums";
import { DatabaseSchema } from "../../../database/schema";
import ADAPTTOKENS, { ICatalogAdapter } from "../../adapt/interfaces";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ICatalogRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { CatalogItemSelectDto } from "../../../../common/dto";


@injectable()
export class CatalogRepository extends BaseRepository implements ICatalogRepository {

  private catalogAdapter: ICatalogAdapter;

  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.CatalogAdapter) catalogAdapter: ICatalogAdapter) {
    super(databaseService);
    this.catalogAdapter = catalogAdapter;
  }

  public async getAll(name: CatalogType): Promise<Array<CatalogItemSelectDto>> {
    return this.database
      .selectFrom("catalog_item")
      .selectAll()
      .where("catalog_item.catalog_name", "=", name)
      .execute();
  }

  // TODO remove items that are not on the server anymore or at least mark them
  public async sync(catalogType: CatalogType, items: Array<string>): Promise<void> {
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      items.forEach(async (item: string) => {

        const existingItem = await trx
          .selectFrom("catalog_item")
          .select("catalog_item.id")
          .where("catalog_item.catalog_name", "=", catalogType)
          .where("catalog_item.item", "=", item)
          .executeTakeFirst();

        if (existingItem) {
          await trx.updateTable("catalog_item")
            .set(this.catalogAdapter.toUpdate({ catalogType: catalogType, item: item }))
            .where("catalog_item.catalog_name", "=", catalogType)
            .where("catalog_item.item", "=", item)
            .executeTakeFirstOrThrow();
        } else {
          await trx.insertInto("catalog_item")
            .values(this.catalogAdapter.toInsert({ catalogType: catalogType, item: item }))
            .executeTakeFirstOrThrow();
        }
      });
    });
  }
}
