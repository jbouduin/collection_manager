import { Props } from "@blueprintjs/core";

export interface DatabaseViewProps extends Props {
  onSynchronizeSet: (setCode: string) => void;
}
