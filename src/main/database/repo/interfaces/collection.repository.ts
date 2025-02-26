import { CollectionDto, OwnedCardListDto, OwnedCardQuantityDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICollectionRepository {
  getAllCollections(): Promise<IResult<Array<CollectionDto>>>;
  getCardQuantitiesForCard(cardId: string): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  getCardQuantitiesForCardInCollection(cardId: string, collectionId: number): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  getCollectionCardList(id: number): Promise<IResult<Array<OwnedCardListDto>>>;
  createCollection(collection: CollectionDto): Promise<IResult<CollectionDto>>;
  deleteCollection(id: number): Promise<IResult<number>>;
  saveQuantitiesForCard(cardId: string, quantities: Array<OwnedCardQuantityDto>): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  saveQuantitiesForCardInCollection(
    cardId: string,
    collectionId: number,
    quantities: Array<OwnedCardQuantityDto>
  ): Promise<IResult<Array<OwnedCardQuantityDto>>>;
  updateCollection(collection: CollectionDto): Promise<IResult<CollectionDto>>;
}
