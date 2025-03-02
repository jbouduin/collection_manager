import { Props } from "@blueprintjs/core";

import { MtgCardDetailViewmodel } from "../../../../viewmodels";
import { CardLayout } from "../../../../../../common/types";

export interface CardImageViewProps extends Props {
  // card: MtgCardDetailViewmodel;
  cardId: string;
  cardLayout: CardLayout;
}
