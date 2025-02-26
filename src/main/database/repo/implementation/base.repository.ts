import { Kysely } from "kysely";
import { DatabaseSchema } from "../../schema";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";

export abstract class BaseRepository {
  //#region private fields ----------------------------------------------------
  private readonly databaseService: IDatabaseService;
  //#endregion

  //#region protected fields --------------------------------------------------
  protected readonly logService: ILogService;
  protected readonly resultFactory: IResultFactory;
  //#endregion

  //#region protected properties ----------------------------------------------
  protected get database(): Kysely<DatabaseSchema> {
    return this.databaseService.database;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(databaseService: IDatabaseService, logService: ILogService, resultFactory: IResultFactory) {
    this.databaseService = databaseService;
    this.logService = logService;
    this.resultFactory = resultFactory;
  }
  //#endregion
}
