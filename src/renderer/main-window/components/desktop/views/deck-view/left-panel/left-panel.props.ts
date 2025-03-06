import { Props } from "@blueprintjs/core";
import { DeckFolderTreeViewmodel } from "../../../../../viewmodels";
import { DeckDto } from "../../../../../../../common/dto";


export interface LeftPanelProps extends Props {
  onFolderSelected: (folder: DeckFolderTreeViewmodel) => void;
  onDeckAdded: (deck: DeckDto) => void;
}
