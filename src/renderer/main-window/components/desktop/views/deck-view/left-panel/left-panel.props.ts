import { Props } from "@blueprintjs/core";
import { DeckFolderTreeViewmodel } from "../../../../../viewmodels";
import { IDeckDto } from "../../../../../../../common/dto";


export interface LeftPanelProps extends Props {
  onFolderSelected: (folder: DeckFolderTreeViewmodel) => void;
  onDeckAdded: (deck: IDeckDto) => void;
}
