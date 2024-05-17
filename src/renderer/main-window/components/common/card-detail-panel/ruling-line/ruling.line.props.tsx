import { Props } from "@blueprintjs/core";
import { RulingLineDto } from "../../../../../../common/dto";

export interface RulingLineProps extends Props {
  ruling: RulingLineDto,
  isLast: boolean
}
