import { IScryfallCardDto, IScryfallCardfaceDto } from "../../../dto";

export type CardFaceAdapterParameter = {
  scryfallCard: IScryfallCardDto;
  scryfallCardfaces?: Array<IScryfallCardfaceDto>;
};
