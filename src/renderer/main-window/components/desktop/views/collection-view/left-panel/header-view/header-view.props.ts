import { Props } from "@blueprintjs/core";

export interface HeaderViewProps extends Props {
  onAddCollection: () => void;
  onAddFolder: () => void;
  onDelete: () => void;
  onEdit: () => void;
  canAddCollection: boolean;
  canAddFolder: boolean;
  canDelete: boolean;
  canEdit: boolean;
}
