import { Props } from "@blueprintjs/core";
import { DtoLanguage } from "../../../../../../common/dto";

export interface CardSetDialogProps extends Props {
  cardSetId: string;
  cardSetSvg: string;
  isOpen: boolean;
  languages: Array<DtoLanguage>;
  onClose: () => void;
}
