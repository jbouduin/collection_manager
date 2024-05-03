import { inject, singleton } from "tsyringe";
import { QueryType } from "../../../common/enums";
import { IDatabaseService } from "../database/database.service";
import { CardSet } from "../database/schema/card-set.table";
import { CatalogItem } from "../database/schema/catalog-item.table";
import TOKENS from "../tokens";

export interface IIpcQueryService {
  handle(queryType: QueryType): void;
}

@singleton()
export class IpcQueryService implements IIpcQueryService {

  private databaseService: IDatabaseService;

  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    this.databaseService = databaseService;
  }

  public async handle(queryType: QueryType): Promise<void> {
    switch (queryType) {
      case "CardSet":
        await this.TestQueryCardSet();
        break;
      case "Card":
        break;
      case "Catalog":
        await this.TestQueryCatalog();
        break;
    }
  }

  private async TestQueryCardSet(): Promise<void> {
    await this.databaseService.database
      .selectFrom("card_set")
      .selectAll()
      .limit(1)
      .execute()
      .then((cardSet: Array<CardSet>) => {
        console.log(typeof cardSet[0]);
        console.log(cardSet[0]);
      });
  }

  private async TestQueryCatalog(): Promise<void> {
    const qb = this.databaseService.database
      .selectFrom("catalog_item")
      .innerJoin("catalog", "catalog.id", "catalog_item.catalog_id")
      .selectAll("catalog_item")
      .where("catalog.name", "=", "ArtifactTypes")
      .limit(1);

    await qb.execute()
      .then((catalogItem: Array<CatalogItem>) => {
        console.log(typeof catalogItem[0]);
        console.log(catalogItem[0]);
      });
  }
}
