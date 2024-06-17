import { Props } from "@blueprintjs/core";

export interface DeckViewProps extends Props {
  onSynchronizeCollection: (ids: Array<string>) => void;
}
