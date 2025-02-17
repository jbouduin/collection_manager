import { DeleteResult, InsertResult, Transaction } from "kysely";
import { inject, injectable } from "tsyringe";
import { CollectionDto, NewCollection } from "../../../../common/dto";
import { sqliteUTCTimeStamp } from "../../../../common/util";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { logCompilable } from "../../log-compilable";
import { DatabaseSchema } from "../../schema";
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

  public create(collection: CollectionDto): Promise<IResult<CollectionDto>> {
    try {
      const now = sqliteUTCTimeStamp;
      const toInsert: NewCollection = {
        name: collection.name,
        description: collection.description,
        is_folder: collection.is_folder ? 1 : 0,
        is_system: collection.is_system ? 1 : 0,
        created_at: now,
        modified_at: now,
        parent_id: collection.parent_id
      };
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .insertInto("collection")
            .values(toInsert)
            .$call((q) => logCompilable(this.logService, q))
            .executeTakeFirstOrThrow()
            .then((r: InsertResult) => trx.selectFrom("collection")
              .selectAll()
              .where("collection.id", "=", Number(r.insertId))
              .$castTo<CollectionDto>()
              .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: CollectionDto) => this.resultFactory.createSuccessResult<CollectionDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<CollectionDto>(err);
    }
  }

  public delete(id: number): Promise<IResult<number>> {
    try {
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx
            .deleteFrom("collection")
            .where("collection.id", "=", id)
            .executeTakeFirstOrThrow()
            .then((r: DeleteResult) => this.resultFactory.createSuccessResult<number>(Number(r.numDeletedRows)));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<number>(err);
    }
  }

  public update(collection: CollectionDto): Promise<IResult<CollectionDto>> {
    try {
      return this.database.transaction()
        .execute(async (trx: Transaction<DatabaseSchema>) => {
          return trx.updateTable("collection")
            .set({
              name: collection.name,
              description: collection.description,
              modified_at: sqliteUTCTimeStamp,
              parent_id: collection.parent_id
            })
            .where("collection.id", "=", collection.id)
            .executeTakeFirstOrThrow()
            .then(() => trx.selectFrom("collection")
              .selectAll()
              .where("collection.id", "=", Number(collection.id))
              .$castTo<CollectionDto>()
              .$call((q) => logCompilable(this.logService, q))
              .executeTakeFirst())
            .then((r: CollectionDto) => this.resultFactory.createSuccessResult<CollectionDto>(r));
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<CollectionDto>(err);
    }
  }
  //#endregion
}
