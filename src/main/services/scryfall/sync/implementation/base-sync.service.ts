import { Kysely } from "kysely";
// import { injectable } from "tsyringe";
import { ProgressCallback, SyncOptions } from "../../../../../common/ipc-params";
import { DatabaseSchema } from "../../../../database/schema";
import { IDatabaseService } from "../../../infra/interfaces";
import { IBaseSyncService } from "../interface/base-sync.service";

// @injectable()
export abstract class BaseSyncService<O extends SyncOptions> implements IBaseSyncService<O> {
  //#region private readonly fields -------------------------------------------
  private readonly databaseService: IDatabaseService;
  //#endregion

  //#region protected properties ----------------------------------------------
  protected get database(): Kysely<DatabaseSchema> {
    return this.databaseService.database;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(databaseService: IDatabaseService) {
    this.databaseService = databaseService;
  }
  //#endregion

  //#region IBaseSyncService abstract methods ---------------------------------
  public abstract sync(params: O, progressCallback: ProgressCallback): Promise<void>;
  //#endregion
}
