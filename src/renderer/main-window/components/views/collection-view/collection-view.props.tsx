import { Props } from "@blueprintjs/core";

export interface CollectionViewProps extends Props {
  onSynchronizeCollection: (ids: Array<string>) => void;
}
