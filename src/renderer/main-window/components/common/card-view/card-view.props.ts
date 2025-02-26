import { Props } from "@blueprintjs/core";

export interface CardViewProps extends Props {
  cardId: string;
  collectionId: number;
  showOtherLanguages: boolean;
}
