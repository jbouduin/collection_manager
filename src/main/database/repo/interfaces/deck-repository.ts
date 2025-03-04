import { DeckListDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface IDeckRepository {
  createDeck(deck: DeckListDto): Promise<IResult<DeckListDto>>;
  deleteDeck(id: number): Promise<IResult<number>>;
  getAll(): Promise<IResult<Array<DeckListDto>>>;
  patchDeck(deck: Partial<DeckListDto>): Promise<IResult<DeckListDto>>;
}
