import { inject, injectable } from "tsyringe";
import { CatalogItemDto, CatalogTypeDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/types";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { logCompilable } from "../../log-compilable";
import { CATALOG_TYPE_TABLE_FIELDS } from "../../schema";
import { ICatalogRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class CatalogRepository extends BaseRepository implements ICatalogRepository {
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }

  public async getCatalogItems(name: CatalogType, query: string): Promise<IResult<Array<CatalogItemDto>>> {
    try {
      return this.database
        .selectFrom("catalog_item")
        .selectAll()
        .where("catalog_item.catalog_name", "=", name)
        .where("catalog_item.item", "like", `%${query}%`)
        .limit(50)
        .$castTo<CatalogItemDto>()
        .$call((q) => logCompilable(this.logService, q))
        .execute()
        .then((r: Array<CatalogItemDto>) => this.resultFactory.createSuccessResult(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<CatalogItemDto>>(err);
    }
  }

  public async getCatalogs(): Promise<IResult<Array<CatalogTypeDto>>> {
    try {
      return this.database
        .selectFrom("catalog_type")
        .select((eb) => [
          ...CATALOG_TYPE_TABLE_FIELDS,
          eb.selectFrom("catalog_item")
            .select((eb) => eb.fn.count("catalog_item.item").as("cnt"))
            .whereRef("catalog_item.catalog_name", "=", "catalog_type.catalog_name")
            .as("count")
        ])
        .$castTo<CatalogTypeDto>()
        .execute()
        .then((r: Array<CatalogTypeDto>) => this.resultFactory.createSuccessResult(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<CatalogTypeDto>>(err);
    }
  }
}
