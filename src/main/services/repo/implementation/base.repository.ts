import { Kysely } from "kysely";
import { DatabaseSchema } from "../../../database/schema";
import { IDatabaseService, ILogService } from "../../infra/interfaces";

export abstract class BaseRepository {
  //#region private fields ----------------------------------------------------
  private readonly databaseService: IDatabaseService;
  //#endregion

  //#region protected fields --------------------------------------------------
  protected readonly logService: ILogService;
  //#endregion

  //#region protected properties ----------------------------------------------
  protected get database(): Kysely<DatabaseSchema> {
    return this.databaseService.database;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(databaseService: IDatabaseService, logService: ILogService) {
    this.databaseService = databaseService;
    this.logService = logService;
  }
  //#endregion
}
