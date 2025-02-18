import { Props } from "@blueprintjs/core";
import { MtgCardDetailViewmodel } from "../../../../viewmodels";

export interface CardHeaderViewProps extends Props {
  card: MtgCardDetailViewmodel;
}
