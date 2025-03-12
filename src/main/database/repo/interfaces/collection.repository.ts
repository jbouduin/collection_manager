import { ICollectionDto, IOwnedCardListDto, IOwnedCardQuantityDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICollectionRepository {
  getAllCollections(): Promise<IResult<Array<ICollectionDto>>>;
  getCardQuantitiesForCard(cardId: string): Promise<IResult<Array<IOwnedCardQuantityDto>>>;
  getCardQuantitiesForCardInCollection(cardId: string, collectionId: number): Promise<IResult<Array<IOwnedCardQuantityDto>>>;
  getCollectionCardList(id: number): Promise<IResult<Array<IOwnedCardListDto>>>;
  createCollection(collection: ICollectionDto): Promise<IResult<ICollectionDto>>;
  deleteCollection(id: number): Promise<IResult<number>>;
  saveQuantitiesForCard(cardId: string, quantities: Array<IOwnedCardQuantityDto>): Promise<IResult<Array<IOwnedCardQuantityDto>>>;
  saveQuantitiesForCardInCollection(
    cardId: string,
    collectionId: number,
    quantities: Array<IOwnedCardQuantityDto>
  ): Promise<IResult<Array<IOwnedCardQuantityDto>>>;
  updateCollection(collection: ICollectionDto): Promise<IResult<ICollectionDto>>;
}
