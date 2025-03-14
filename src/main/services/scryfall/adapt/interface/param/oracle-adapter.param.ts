import { IScryfallCardDto, IScryfallCardfaceDto } from "../../../dto";

export type OracleAdapterParameter = {
  oracleId: string;
  scryfallCard?: IScryfallCardDto;
  scryfallCardFace?: IScryfallCardfaceDto;
  sequence: number;
};
