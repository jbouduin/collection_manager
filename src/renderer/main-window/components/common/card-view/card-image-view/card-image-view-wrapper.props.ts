import { Props } from "@blueprintjs/core";

import { CardLayout } from "../../../../../../common/enums";
import { CardfaceViewmodel } from "../../../../viewmodels";

export interface CardImageViewWrapperProps extends Props {
  cardface: CardfaceViewmodel;
  layout: CardLayout;
}
