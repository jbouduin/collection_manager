import { inject, injectable } from "tsyringe";

import { CatalogItemSelectDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/enums";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ICatalogRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CatalogRepository extends BaseRepository implements ICatalogRepository {

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  public async getAll(name: CatalogType): Promise<Array<CatalogItemSelectDto>> {
    return this.database
      .selectFrom("catalog_item")
      .selectAll()
      .where("catalog_item.catalog_name", "=", name)
      .execute();
  }


}
