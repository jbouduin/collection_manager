import { TreeNodeInfo } from "@blueprintjs/core";
import { CardSetSelectDto } from "../../../common/dto";

export interface DatabaseViewState {
  nodes: Array<TreeNodeInfo<CardSetSelectDto>>;
  currentSelectedPath?: Array<number>;
  currentSelectedSets?: Array<CardSetSelectDto>;
}
