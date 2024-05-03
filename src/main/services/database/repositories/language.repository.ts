import { inject, injectable } from "tsyringe";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { Language } from "../schema/language.table";
import { BaseRepository } from "./base.repository";

export interface ILanguageRepository {
  getAll(): Promise<Array<Language>>;
}

@injectable()
export class LanguageRepository extends BaseRepository implements ILanguageRepository {

  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }


  getAll(): Promise<Array<Language>> {
    return this.database.selectFrom("language").selectAll().execute();
  }
}
