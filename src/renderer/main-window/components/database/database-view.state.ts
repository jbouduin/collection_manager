import { TreeNodeInfo } from "@blueprintjs/core";
import { CardSelectDto, CardSetSelectDto } from "../../../../common/dto";

export interface DatabaseViewState {
  nodes: Array<TreeNodeInfo<CardSetSelectDto>>;
  currentSelectedPath?: Array<number>;
  currentSelectedSets?: Array<CardSetSelectDto>;
  currentSelectedCards?: Array<CardSelectDto>;
}
