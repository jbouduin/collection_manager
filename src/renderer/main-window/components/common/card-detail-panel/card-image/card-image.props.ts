import { Props } from "@blueprintjs/core";
import { CardViewmodel } from "../../../../view-models/card.view-model";

export interface CardImageProps extends Props {
  card?: CardViewmodel;
}
