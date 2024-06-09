import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs, QueryResult, RootOperationNode, UnknownRow } from "kysely";
import { ProgressCallback } from "../../../common/ipc-params";

// NOW check solution proposed by kysely team
export class MigrationKyselyPlugin implements KyselyPlugin {

  //#region private fields ----------------------------------------------------
  private readonly progressCallback: ProgressCallback;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(progressCallback: ProgressCallback) {
    this.progressCallback = progressCallback;
  }
  //#endregion

  //#region KyselyPlugin methods ----------------------------------------------
  public transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    switch (args.node.kind) {
      case "CreateTableNode":
        this.progressCallback(`creating table ${args.node.table.table.identifier.name}`);
        break;
      case "DropTableNode":
        this.progressCallback(`drop table ${args.node.table.table.identifier.name}`);
        break;
    }
    // LATER otherer kinds
    return args.node;
  }

  public async transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>> {
    return args.result;
  }
  //#endregion
}
