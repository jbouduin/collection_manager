import { ISyncParamDto } from "../../../../../common/dto";
import { BaseDialogProps } from "../../../../shared/components/base";


export interface SyncDialogProps extends BaseDialogProps {
  onOkClick: (syncParam: ISyncParamDto) => void;
}
