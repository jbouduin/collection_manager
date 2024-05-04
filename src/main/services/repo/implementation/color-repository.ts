import { inject, injectable } from "tsyringe";
import { ColorSelectDto } from "../../../../common/dto";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { IColorRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class ColorRepository extends BaseRepository implements IColorRepository {

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }


  getAll(): Promise<Array<ColorSelectDto>> {
    return this.database.selectFrom("color").selectAll().execute();
  }
}
