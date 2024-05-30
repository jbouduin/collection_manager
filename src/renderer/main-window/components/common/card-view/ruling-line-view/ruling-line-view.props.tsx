import { Props } from "@blueprintjs/core";
import { DtoRulingLine } from "../../../../../../common/dto";

export interface RulingLineViewProps extends Props {
  ruling: DtoRulingLine,
  isLast: boolean
}
