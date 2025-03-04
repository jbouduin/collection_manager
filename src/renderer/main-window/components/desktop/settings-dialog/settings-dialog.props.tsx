import { ConfigurationDto } from "../../../../../common/dto";
import { BaseDialogProps } from "../../../../shared/components";


export interface SettingsDialogProps extends BaseDialogProps {
  afterSave: (saved: ConfigurationDto) => void;
}
