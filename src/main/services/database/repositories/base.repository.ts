import { Kysely } from "kysely";
import { inject, injectable } from "tsyringe";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { DatabaseSchema } from "../schema/database.schema";


@injectable()
export class BaseRepository {
  private databaseService: IDatabaseService;

  protected get database(): Kysely<DatabaseSchema> {
    return this.databaseService.database;
  }

  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    this.databaseService = databaseService;
  }
}
