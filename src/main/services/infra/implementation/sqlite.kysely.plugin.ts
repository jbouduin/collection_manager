import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs, QueryResult, RootOperationNode, UnknownRow } from "kysely";

export class SqliteKyselyPlugin implements KyselyPlugin {
  //#region KyselyPlugin methods ----------------------------------------------
  public transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    return args.node;
  }

  public async transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>> {
    const result: QueryResult<UnknownRow> = {
      ...args.result,
      rows: args.result.rows.map((r) => this.processAny(r))
    };
    return result;
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private processAny(obj: Record<string, any>): Record<string, any> {
    for (const key in obj) {
      // Remark: we'll have to do it like this, until we find another way to identify date and boolean fields
      if (key.endsWith("_at") && obj[key]) {
        obj[key] = new Date(obj[key] as string);
      } else if (key.startsWith("is_")) {
        obj[key] = obj[key] as number > 0 ? true : false;
      } else if (typeof obj[key] == "object") {
        obj[key] = this.processAny(obj[key]);
      }
    }
    return obj;
  }
  //#endregion
}
