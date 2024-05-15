import { Props } from "@blueprintjs/core";
import { CardSetSelectDto } from "../../../../common/dto";

export interface DesktopProps extends Props {
  cardSets: Array<CardSetSelectDto>;
  cachedSvg: Map<string, string>;
}
