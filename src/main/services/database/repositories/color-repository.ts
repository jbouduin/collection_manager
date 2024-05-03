import { inject, injectable } from "tsyringe";
import TOKENS from "../../tokens";
import { IDatabaseService } from "../database.service";
import { BaseRepository } from "./base.repository";
import { Color } from "../schema/color.table";

export interface IColorRepository {
  getAll(): Promise<Array<Color>>;
}

@injectable()
export class ColorRepository extends BaseRepository implements IColorRepository {

  public constructor(@inject(TOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }


  getAll(): Promise<Array<Color>> {
    return this.database.selectFrom("color").selectAll().execute();
  }
}
