import { Props } from "@blueprintjs/core";
import { CatalogTypeDto } from "../../../../common/dto";
import { SyncParamViewmodel } from "../../viewmodels";


export interface SyncParameterViewProps extends Props {
  catalogs: Array<CatalogTypeDto>;
  onSyncParamChanged: (syncParam: SyncParamViewmodel) => void;
  syncParam: SyncParamViewmodel;
}
