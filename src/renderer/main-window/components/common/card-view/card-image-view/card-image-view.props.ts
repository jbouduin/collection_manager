import { Props } from "@blueprintjs/core";
import { CardLayout } from "../../../../../../common/types";


export interface CardImageViewProps extends Props {
  cardId: string;
  cardLayout: CardLayout;
}
