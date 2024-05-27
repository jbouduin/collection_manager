import { ScryfallCard, ScryfallCardface } from "../../../types";

export type OracleAdapterParameter = {
  oracleId: string;
  scryfallCard?: ScryfallCard;
  scryfallCardFace?: ScryfallCardface;
  sequence: number;
};
