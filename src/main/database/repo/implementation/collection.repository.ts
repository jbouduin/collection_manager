import { DeleteResult } from "kysely";
import { inject, injectable } from "tsyringe";
import { CollectionDto, NewCollection, UpdateCollection } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { ICollectionRepository } from "../interfaces/collection.repository";
import { BaseRepository } from "./base.repository";


@injectable()
export class CollectionRepository extends BaseRepository implements ICollectionRepository {
  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }
  //#endregion

  //#region ICollectionRepository methods -------------------------------------
  public getAll(): Promise<IResult<Array<CollectionDto>>> {
    try {
      return this.database.selectFrom("collection")
        .selectAll()
        .$castTo<CollectionDto>()
        .execute()
        .then((qryResult: Array<CollectionDto>) => this.resultFactory.createSuccessResult<Array<CollectionDto>>(qryResult));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<CollectionDto>>(err);
    }
  }

  public create(_collection: NewCollection): Promise<CollectionDto> {
    throw new Error("Method not implemented.");
  }

  public delete(_id: number): Promise<DeleteResult> {
    throw new Error("Method not implemented.");
  }

  public update(_collection: UpdateCollection): Promise<CollectionDto> {
    throw new Error("Method not implemented.");
  }
  //#endregion
}
