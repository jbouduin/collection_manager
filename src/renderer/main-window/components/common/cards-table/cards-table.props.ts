import { Props } from "@blueprintjs/core";

export interface CardsTableProps extends Props {
  cachedSvg: Map<string, string>;
  selectedSetIds: Array<string>;
  onCardSelected(cardId?: string): void;
}
