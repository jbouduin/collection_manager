import { Compilable, ExpressionOrFactory, InsertResult, Kysely, SqlBool, Transaction, UpdateResult } from "kysely";
import * as path from "path";
import * as fs from "fs";

import { ProgressCallback, SyncOptions } from "../../../../../common/ipc-params";
import { DatabaseSchema } from "../../../../database/schema";
import { IConfigurationService, IDatabaseService } from "../../../infra/interfaces";
import { IBaseSyncService } from "../interface/base-sync.service";
import { ExtractTableAlias } from "kysely/dist/cjs/parser/table-parser";
import { ITableAdapter } from "../../adapt/interface/table.adapter";
import { GenericSyncTaskParameter } from "./generic-sync-task.parameter";
import { DtoSyncParam } from "../../../../../common/dto";
import { IScryfallClient } from "../../client/interfaces";
import { formatTimeStampedFileName } from "../../../../../common/util";

// @injectable()
export abstract class BaseSyncService<O extends SyncOptions> implements IBaseSyncService<O> {
  //#region private readonly fields -------------------------------------------
  private readonly databaseService: IDatabaseService;
  //#endregion

  //#region protected readonly fields -----------------------------------------
  protected readonly configurationService: IConfigurationService;
  protected readonly scryfallclient: IScryfallClient;
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
    scryfallclient: IScryfallClient) {
    this.databaseService = databaseService;
    this.configurationService = configurationService;
    this.scryfallclient = scryfallclient;
  }
  //#endregion

  //#region IBaseSyncService abstract methods ---------------------------------
  public abstract sync(params: O, progressCallback: ProgressCallback): Promise<void>;
  public abstract newSync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void>;
  //#endregion

  protected logCompilable<T extends Compilable>(compilable: T): T {
    console.log(compilable.compile());
    return compilable;
  }

  protected dumpScryFallData(unstampedFileName: string, data: unknown) {
    if (this.configurationService.configuration.scryfallConfiguration.dumpRetrievedData) {
      const targetDir = path.join(this.configurationService.cacheDirectory, "json");
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
    scryfall: S): Promise<InsertResult | UpdateResult> {
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
    taskParameter: GenericSyncTaskParameter<TB, S>, _index: number, _total: number): Promise<void> {
    await this.genericSingleSync(taskParameter.trx, taskParameter.tableName, taskParameter.filter, taskParameter.adapter, taskParameter.scryfall);
  }

  protected async genericDeleteAndRecreate<TB extends keyof DatabaseSchema, S>(
    trx: Transaction<DatabaseSchema>,
    tableName: TB,
    filter: ExpressionOrFactory<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>, SqlBool>,
    adapter: ITableAdapter<TB, S>,
    scryfall: S) {

    return trx
      .deleteFrom(tableName)
      .where(filter)
      // .$call(this.logCompilable)
      .execute()
      .then(async () => await trx
        .insertInto(tableName)
        .values(adapter.toInsert(scryfall))
        // .$call(this.logCompilable)
        .executeTakeFirstOrThrow()
      );
  }

  protected async serialGenericDeleteAndRecreate<TB extends keyof DatabaseSchema, S>(
    taskParameter: GenericSyncTaskParameter<TB, S>, _index: number, _total: number): Promise<void> {
    await this.genericDeleteAndRecreate(taskParameter.trx, taskParameter.tableName, taskParameter.filter, taskParameter.adapter, taskParameter.scryfall);
  }
}
