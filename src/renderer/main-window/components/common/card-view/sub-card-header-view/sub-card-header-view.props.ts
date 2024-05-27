import { Props } from "@blueprintjs/core";

import { CardfaceViewmodel } from "../../../../viewmodels";

export interface SubCardHeaderViewProps extends Props {
  cardface: CardfaceViewmodel;
  symbolSvgs: Map<string, string>;
  showManaCost: boolean;
}
