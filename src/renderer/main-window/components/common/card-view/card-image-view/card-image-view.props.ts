import { Props } from "@blueprintjs/core";

import { MtgCardDetailViewmodel } from "../../../../viewmodels";

export interface CardImageViewProps extends Props {
  card: MtgCardDetailViewmodel;
}
