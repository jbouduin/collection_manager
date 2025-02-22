import { ConfigurationDto } from "../../../../../common/dto";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";

export interface SettingsDialogProps extends BaseDialogProps {
  afterSave: (saved: ConfigurationDto)=> void;
}
