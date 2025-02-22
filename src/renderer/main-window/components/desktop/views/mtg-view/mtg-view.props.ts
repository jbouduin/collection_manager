import { Props } from "@blueprintjs/core";


export interface MtgViewProps extends Props {
  onSynchronizeSet: (setCode: string) => void;
}
