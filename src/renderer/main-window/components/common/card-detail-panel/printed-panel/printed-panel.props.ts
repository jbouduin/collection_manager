import { Props } from "@blueprintjs/core";

import { CardViewmodel } from "../../../../viewmodels";

export interface PrintedPanelProps extends Props {
  card?: CardViewmodel;
  symbolSvgs: Map<string, string>;
}
