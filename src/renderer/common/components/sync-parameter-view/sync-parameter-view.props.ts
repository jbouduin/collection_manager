import { Props } from "@blueprintjs/core";

import { SyncParamViewmodel } from "../../viewmodels/sync-param/sync-param.viewmodel";

export interface SyncParameterViewProps extends Props {
  syncParam: SyncParamViewmodel;
  onSyncParamChanged: (syncParam: SyncParamViewmodel) => void;
}
