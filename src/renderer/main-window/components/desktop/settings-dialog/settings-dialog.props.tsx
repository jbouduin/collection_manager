import { IConfigurationDto } from "../../../../../common/dto";
import { BaseDialogProps } from "../../../../shared/components/base";


export interface SettingsDialogProps extends BaseDialogProps {
  afterSave: (saved: IConfigurationDto) => void;
}
