import { Props } from "@blueprintjs/core";
import { ICatalogTypeDto } from "../../../../common/dto";
import { SyncParamViewmodel } from "../../viewmodels";


export interface SyncParameterViewProps extends Props {
  catalogs: Array<ICatalogTypeDto>;
  onSyncParamChanged: (syncParam: SyncParamViewmodel) => void;
  syncParam: SyncParamViewmodel;
}
