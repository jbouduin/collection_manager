import { Props } from "@blueprintjs/core";

import { MtgCardDetailViewmodel } from "../../../../viewmodels";

export interface CardRulingsViewProps extends Props {
  card?: MtgCardDetailViewmodel;
}
