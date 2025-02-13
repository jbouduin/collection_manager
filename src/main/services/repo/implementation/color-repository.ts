import { inject, injectable } from "tsyringe";
import { ColorDto } from "../../../../common/dto";
import { IDatabaseService, ILogService } from "../../infra/interfaces";
import { IColorRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { INFRASTRUCTURE } from "../../service.tokens";

@injectable()
export class ColorRepository extends BaseRepository implements IColorRepository {
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService
  ) {
    super(databaseService, logService);
  }

  getAll(): Promise<Array<ColorDto>> {
    return this.database
      .selectFrom("color")
      .selectAll()
      .execute();
  }
}
