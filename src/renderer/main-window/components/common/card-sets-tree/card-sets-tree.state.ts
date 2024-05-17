import { Props, TreeNodeInfo } from "@blueprintjs/core";
import { CardSetDto } from "../../../../../common/dto";

export interface CardSetTreeState extends Props {
  nodes: Array<TreeNodeInfo<CardSetDto>>;
  currentSelectedPath?: Array<number>;
  currentSelectedSets?: Array<CardSetDto>;
}
