import { ScryfallImageUris } from "../../../types";

export type CardfaceImageAdapterParameter = {
  cardId: string;
  images: Map<number, ScryfallImageUris>;
};
