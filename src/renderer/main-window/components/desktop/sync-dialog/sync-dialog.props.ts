import { SyncParamDto } from "../../../../../common/dto";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";


export interface SyncDialogProps extends BaseDialogProps {
  onOkClick: (syncParam: SyncParamDto) => void;
}
