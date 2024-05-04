import { Kysely } from "kysely";
import { inject, injectable } from "tsyringe";
import { DatabaseSchema } from "../../../database/schema";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";


@injectable()
export class BaseRepository {
  private readonly databaseService: IDatabaseService;

  protected get database(): Kysely<DatabaseSchema> {
    return this.databaseService.database;
  }

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    this.databaseService = databaseService;
  }
}
