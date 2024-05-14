import { Props } from "@blueprintjs/core";

export interface CardsTableProps extends Props {
  onCardSelected(cardId?: string): void;
}
