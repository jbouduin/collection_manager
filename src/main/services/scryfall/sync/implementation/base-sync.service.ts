import * as fs from "fs";
import { ExpressionOrFactory, InsertResult, Kysely, SqlBool, Transaction, UpdateResult } from "kysely";
import { ExtractTableAlias } from "kysely/dist/cjs/parser/table-parser";
import * as path from "path";
import { ProgressCallback } from "../../../../../common/ipc";
import { formatTimeStampedFileName } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../database/schema";
import { IConfigurationService, IDatabaseService, ILogService } from "../../../infra/interfaces";
import { ITableAdapter } from "../../adapt/interface/table.adapter";
import { IScryfallClient } from "../../client/interfaces";
import { IBaseSyncService } from "../interface/base-sync.service";
import { GenericSyncTaskParameter } from "./generic-sync-task.parameter";
import { logCompilable } from "../../../../database/log-compilable";


export abstract class BaseSyncService<T> implements IBaseSyncService<T> {
  //#region private readonly fields -------------------------------------------
  private readonly databaseService: IDatabaseService;
  //#endregion

  //#region protected readonly fields -----------------------------------------
  protected readonly configurationService: IConfigurationService;
  protected readonly scryfallclient: IScryfallClient;
  protected readonly logService: ILogService;
  //#endregion

  //#region protected properties ----------------------------------------------
  protected get database(): Kysely<DatabaseSchema> {
    return this.databaseService.database;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    databaseService: IDatabaseService,
    configurationService: IConfigurationService,
    logService: ILogService,
    scryfallclient: IScryfallClient
  ) {
    this.databaseService = databaseService;
    this.configurationService = configurationService;
    this.logService = logService;
    this.scryfallclient = scryfallclient;
  }
  //#endregion

  //#region IBaseSyncService abstract methods ---------------------------------
  public abstract sync(syncParam: T, progressCallback: ProgressCallback): Promise<void>;
  //#endregion

  //#region Protected auxiliary methods ---------------------------------------
  protected dumpScryFallData(unstampedFileName: string, data: unknown) {
    if (this.configurationService.configuration.scryfallConfiguration.dumpRetrievedData) {
      const targetDir = path.join(this.configurationService.configuration.dataConfiguration.cacheDirectory, "json");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetPath = path.join(targetDir, formatTimeStampedFileName(unstampedFileName));
      fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
    }
  }

  protected async genericSingleSync<TB extends keyof DatabaseSchema, S>(
    trx: Transaction<DatabaseSchema>,
    tableName: TB,
    filter: ExpressionOrFactory<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>, SqlBool>,
    adapter: ITableAdapter<TB, S>,
    scryfall: S
  ): Promise<InsertResult | UpdateResult> {
    const queryExisting = trx
      .selectFrom(tableName)
      .selectAll()
      .where(filter)
      .executeTakeFirst();

    const insertOrUpdate: Promise<InsertResult | UpdateResult> = queryExisting.then(async (queryResult) => {
      let result: Promise<InsertResult | UpdateResult>;
      if (queryResult) {
        result = trx.updateTable(tableName)
          .set(adapter.toUpdate(scryfall))
          .where(filter)
          .executeTakeFirstOrThrow();
      } else {
        result = trx.insertInto(tableName)
          .values(adapter.toInsert(scryfall))
          .executeTakeFirstOrThrow();
      }
      return result;
    });
    return insertOrUpdate;
  }

  protected async serialGenericSingleSync<TB extends keyof DatabaseSchema, S>(
    taskParameter: GenericSyncTaskParameter<TB, S>,
    _index: number,
    _total: number
  ): Promise<void> {
    await this.genericSingleSync(taskParameter.trx, taskParameter.tableName, taskParameter.filter, taskParameter.adapter, taskParameter.scryfall);
  }

  protected async genericDeleteAndRecreate<TB extends keyof DatabaseSchema, S>(
    trx: Transaction<DatabaseSchema>,
    tableName: TB,
    filter: ExpressionOrFactory<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>, SqlBool>,
    adapter: ITableAdapter<TB, S>,
    scryfall: S
  ) {
    return trx
      .deleteFrom(tableName)
      .where(filter)
      // .$call((q) => logCompilable(this.logService, q))
      .execute()
      .then(async () => await trx
        .insertInto(tableName)
        .values(adapter.toInsert(scryfall))
        .$call((q) => logCompilable(this.logService, q))
        .executeTakeFirstOrThrow());
  }

  protected async serialGenericDeleteAndRecreate<TB extends keyof DatabaseSchema, S>(
    taskParameter: GenericSyncTaskParameter<TB, S>,
    _index: number,
    _total: number
  ): Promise<void> {
    await this.genericDeleteAndRecreate(taskParameter.trx, taskParameter.tableName, taskParameter.filter, taskParameter.adapter, taskParameter.scryfall);
  }
  //#endregion
}
