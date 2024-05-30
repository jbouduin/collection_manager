import { Props } from "@blueprintjs/core";

import { CardfaceViewmodel } from "../../../../viewmodels";

export interface PrintedViewProps extends Props {
  cardface: CardfaceViewmodel;
  symbolSvgs: Map<string, string>;
}
