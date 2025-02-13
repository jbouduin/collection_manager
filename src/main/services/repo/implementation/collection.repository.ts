import { DeleteResult } from "kysely";
import { ICollectionRepository } from "../interfaces/collection.repository";
import { DtoCollection, NewCollection, UpdateCollection } from "../../../../common/dto";
import { BaseRepository } from "./base.repository";
import { inject, injectable } from "tsyringe";
import { IDatabaseService, ILogService } from "../../infra/interfaces";
import { INFRASTRUCTURE } from "../../service.tokens";

@injectable()
export class CollectionRepository extends BaseRepository implements ICollectionRepository {
  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService
  ) {
    super(databaseService, logService);
  }
  //#endregion

  //#region ICollectionRepository methods -------------------------------------
  public getAll(): Promise<Array<DtoCollection>> {
    return this.database.selectFrom("collection")
      .selectAll()
      .$castTo<DtoCollection>()
      .execute();
  }

  public create(_collection: NewCollection): Promise<DtoCollection> {
    throw new Error("Method not implemented.");
  }

  public delete(_id: number): Promise<DeleteResult> {
    throw new Error("Method not implemented.");
  }

  public update(_collection: UpdateCollection): Promise<DtoCollection> {
    throw new Error("Method not implemented.");
  }
  //#endregion
}
