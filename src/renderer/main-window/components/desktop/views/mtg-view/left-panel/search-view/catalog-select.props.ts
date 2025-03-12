import { Props } from "@blueprintjs/core";
import { ICatalogItemDto, ICatalogTypeDto } from "../../../../../../../../common/dto";


export interface CatalogSelectProps extends Props {
  catalog: ICatalogTypeDto;
  selectedItems: Array<ICatalogItemDto>;

  onOptionAdded: (item: ICatalogItemDto) => void;
  onOptionRemoved: (item: ICatalogItemDto) => void;
  onClearOptions: () => void;
}
