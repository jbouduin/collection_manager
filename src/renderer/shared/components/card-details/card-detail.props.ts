import { Props } from "@blueprintjs/core";

export interface CardDetailProps extends Props {
  cardId: string;
  collectionId: number;
  showOtherLanguages: boolean;
}
