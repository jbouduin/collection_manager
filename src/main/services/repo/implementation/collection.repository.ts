import { DeleteResult } from "kysely";
import { ICollectionRepository } from "../interfaces/collection.repository";

import { DtoCollection, NewCollection, UpdateCollection } from "../../../../common/dto";
import { BaseRepository } from "./base.repository";
import { inject, injectable } from "tsyringe";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";

@injectable()
export class CollectionRepository extends BaseRepository implements ICollectionRepository {

  //#region Constructor -------------------------------------------------------
  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }
  //#endregion

  //#region ICollectionRepository methods -------------------------------------
  public getAll(): Promise<Array<DtoCollection>> {
    return this.database.selectFrom("collection")
      .selectAll()
      .$castTo<DtoCollection>()
      .execute();
  }

  public create(collection: NewCollection): Promise<DtoCollection> {
    throw new Error("Method not implemented.");
  }

  public delete(id: number): Promise<DeleteResult> {
    throw new Error("Method not implemented.");
  }

  update(collection: UpdateCollection): Promise<DtoCollection> {
    throw new Error("Method not implemented.");
  }
  //#endregion
}
