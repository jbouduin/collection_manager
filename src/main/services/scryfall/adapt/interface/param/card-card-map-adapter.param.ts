import { IScryfallRelatedCardDto } from "../../../dto";

export type CardCardMapAdapterParameter = {
  cardId: string;
  relatedCards: Array<IScryfallRelatedCardDto>;
};
