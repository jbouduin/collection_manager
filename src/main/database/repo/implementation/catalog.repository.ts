import { inject, injectable } from "tsyringe";
import { ICatalogItemDto, ICatalogTypeDto } from "../../../../common/dto";
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

  public async getCatalogItems(name: CatalogType, query: string): Promise<IResult<Array<ICatalogItemDto>>> {
    try {
      return this.database
        .selectFrom("catalog_item")
        .selectAll()
        .where("catalog_item.catalog_name", "=", name)
        .$if(
          query?.length > 0,
          (eb) => eb.where("catalog_item.item", "like", `%${query}%`)
        )
        .limit(50)
        .$castTo<ICatalogItemDto>()
        .$call((q) => logCompilable(this.logService, q))
        .execute()
        .then((r: Array<ICatalogItemDto>) => this.resultFactory.createSuccessResult(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<ICatalogItemDto>>(err);
    }
  }

  public async getCatalogs(): Promise<IResult<Array<ICatalogTypeDto>>> {
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
        .$castTo<ICatalogTypeDto>()
        .execute()
        // filter after retrieving -> kysely + sqlite does not allow filtering on booleans
        .then((r: Array<ICatalogTypeDto>) => this.resultFactory.createSuccessResult(r.filter((f: ICatalogTypeDto) => f.is_used)));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<ICatalogTypeDto>>(err);
    }
  }
}
