import { DtoSyncParam } from "../../../../../common/dto";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";


export interface SyncDialogProps extends BaseDialogProps {
  onOkClick: (syncParam: DtoSyncParam) => void
}
