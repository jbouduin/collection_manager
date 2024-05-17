import { Props } from "@blueprintjs/core";
import { CardDto, CardSetDto } from "../../../../../common/dto";

export interface CardDetailPanelProps extends Props {
  card?: CardDto;
  cardSet?: CardSetDto;
}
