import { inject, injectable } from "tsyringe";

import { CardSetDto } from "../../../../common/dto";
import { CardSet } from "../../../database/schema";
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
  public getAll(): Promise<Array<CardSetDto>> {
    return this.database
      .selectFrom("card_set")
      .selectAll()
      .execute()
      .then((cardSets: Array<CardSet>) => cardSets.map<CardSetDto>((cardSet: CardSet) => {
        return {
          cardSet: cardSet,
          svg: this.imageCacheService.getCardSetSvg(cardSet)
        } as CardSetDto;
      }));
  }
  //#endregion
}
