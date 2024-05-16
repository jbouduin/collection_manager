import { Props } from "@blueprintjs/core";
import { CardSelectDto, CardSetSelectDto } from "../../../../../common/dto";

export interface CardDetailPanelProps extends Props {
  card?: CardSelectDto;
  cardSet?: CardSetSelectDto;
}
