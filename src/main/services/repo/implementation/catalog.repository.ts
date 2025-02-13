import { inject, injectable } from "tsyringe";
import { CatalogItemDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/types";
import { IDatabaseService, ILogService } from "../../infra/interfaces";
import { INFRASTRUCTURE } from "../../service.tokens";
import { ICatalogRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CatalogRepository extends BaseRepository implements ICatalogRepository {
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService
  ) {
    super(databaseService, logService);
  }

  public async getAll(name: CatalogType): Promise<Array<CatalogItemDto>> {
    return this.database
      .selectFrom("catalog_item")
      .selectAll()
      .where("catalog_item.catalog_name", "=", name)
      .execute();
  }
}
