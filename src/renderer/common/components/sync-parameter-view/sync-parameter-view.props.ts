import { Props } from "@blueprintjs/core";

import { SyncParamViewmodel } from "../../viewmodels/sync-param/sync-param.viewmodel";
import { CatalogTypeDto } from "../../../../common/dto";

export interface SyncParameterViewProps extends Props {
  syncParam: SyncParamViewmodel;
  catalogs: Array<CatalogTypeDto>;
  onSyncParamChanged: (syncParam: SyncParamViewmodel) => void;
}
