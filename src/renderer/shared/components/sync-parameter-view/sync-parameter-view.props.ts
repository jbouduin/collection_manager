import { Props } from "@blueprintjs/core";
import { ICatalogTypeDto, IScryfallBulkDataItemDto } from "../../../../common/dto";
import { SyncParamViewmodel } from "../../viewmodels";


export interface SyncParameterViewProps extends Props {
  catalogs: Array<ICatalogTypeDto>;
  isConfigurationView: boolean;
  onSyncParamChanged: (syncParam: SyncParamViewmodel) => void;
  scryfallBulkItems?: Array<IScryfallBulkDataItemDto>;
  syncParam: SyncParamViewmodel;
}
