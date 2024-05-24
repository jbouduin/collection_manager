import { inject, injectable } from "tsyringe";

import { DtoCardSet } from "../../../../common/dto";
import INFRATOKENS, { IDatabaseService, IImageCacheService } from "../../infra/interfaces";
import { ICardSetRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class CardSetRepository extends BaseRepository implements ICardSetRepository {

  //#region private readonly fields -------------------------------------------
  private readonly imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService) {
    super(databaseService);
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSetRepository methods ----------------------------------------
  public getAll(): Promise<Array<DtoCardSet>> {
    return this.database
      .selectFrom("card_set")
      .selectAll()
      .$castTo<DtoCardSet>()
      .execute()
      .then((qryResult: Array<DtoCardSet>) => {
        qryResult.forEach((cardSet: DtoCardSet) => cardSet.svg = this.imageCacheService.getCardSetSvg(cardSet));
        return qryResult;
      });
  }
  //#endregion
}
