import { Props } from "@blueprintjs/core";

export interface ManaCostProps extends Props {
  manacost: Array<string>;
  symbolSvgs: Map<string, string>;
}
