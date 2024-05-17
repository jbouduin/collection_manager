import { Props } from "@blueprintjs/core";
import { CardDto } from "../../../../../../common/dto";

export interface CardImageProps extends Props {
  card?: CardDto;
}
