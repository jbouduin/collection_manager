import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { IOracleKeywordAdapter } from "../interface";
import { OracleKeywordAdapterParameter } from "../interface/param";


export class OracleKeywordAdapter implements IOracleKeywordAdapter {
  public toInsert(scryfall: OracleKeywordAdapterParameter): InsertExpression<DatabaseSchema, "oracle_keyword"> {
    return scryfall.keywords.map((keyword: string) => {
      return {
        oracle_id: scryfall.oracle_id,
        keyword: keyword
      };
    });
  }

  public toUpdate(_scryfall: OracleKeywordAdapterParameter): UpdateObjectExpression<DatabaseSchema, "oracle_keyword"> {
    throw new Error("Method not supported.");
  }
}
