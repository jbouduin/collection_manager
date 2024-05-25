import { Props } from "@blueprintjs/core";
import { DtoRulingLine } from "../../../../../../common/dto";

export interface RulingLineProps extends Props {
  ruling: DtoRulingLine,
  isLast: boolean
}
