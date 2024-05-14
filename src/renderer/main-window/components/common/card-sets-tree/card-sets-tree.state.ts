import { Props, TreeNodeInfo } from "@blueprintjs/core";
import { CardSetSelectDto } from "../../../../../common/dto";

export interface CardSetTreeState extends Props {
  nodes: Array<TreeNodeInfo<CardSetSelectDto>>;
  currentSelectedPath?: Array<number>;
  currentSelectedSets?: Array<CardSetSelectDto>;
}
