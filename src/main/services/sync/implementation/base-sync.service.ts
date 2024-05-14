import { Kysely } from "kysely";
import { injectable } from "tsyringe";
import { DatabaseSchema } from "../../../database/schema";
import { IDatabaseService } from "../../infra/interfaces";


@injectable()
export class BaseSyncService {
  //#region private readonly fields -------------------------------------------
  private readonly databaseService: IDatabaseService;
  //#endregion

  //#region protected properties ----------------------------------------------
  protected get database(): Kysely<DatabaseSchema> {
    return this.databaseService.database;
  }
  //#endregion

// public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
  public constructor(databaseService: IDatabaseService) {
    this.databaseService = databaseService;
  }
}
