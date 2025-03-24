import { Props } from "@blueprintjs/core";
import { ICatalogItemDto, ICatalogTypeDto } from "../../../../../../../../common/dto";


export interface CatalogSelectProps extends Props {
  catalogType: ICatalogTypeDto;
  onCatalogItemAdded: (item: ICatalogItemDto) => void;
  onCatalogItemRemoved: (item: ICatalogItemDto) => void;
  onClearSelectedCatalogItems: () => void;
  selectedCatalogItems: Array<ICatalogItemDto>;
}
