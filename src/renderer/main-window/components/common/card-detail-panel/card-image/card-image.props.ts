import { Props } from "@blueprintjs/core";
import { CardSelectDto } from "../../../../../../common/dto";

export interface CardImageProps extends Props {
  card?: CardSelectDto;
}
