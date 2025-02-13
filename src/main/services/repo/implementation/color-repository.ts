import { inject, injectable } from "tsyringe";

import { ColorDto } from "../../../../common/dto";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { IColorRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class ColorRepository extends BaseRepository implements IColorRepository {
  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  getAll(): Promise<Array<ColorDto>> {
    return this.database
      .selectFrom("color")
      .selectAll()
      .execute();
  }
}
