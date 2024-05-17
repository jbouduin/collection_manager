import { Compilable, Kysely, UpdateQueryBuilderWithRightJoin } from "kysely";
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

  protected logCompilable<T extends Compilable>(compilable: T): T {
    console.log(compilable.compile());
    return compilable;
  }
}
