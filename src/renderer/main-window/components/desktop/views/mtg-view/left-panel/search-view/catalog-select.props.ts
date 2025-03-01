import { Props } from "@blueprintjs/core";
import { CatalogItemDto, CatalogTypeDto } from "../../../../../../../../common/dto";


export interface CatalogSelectProps extends Props {
  catalog: CatalogTypeDto;
  selectedItems: Array<CatalogItemDto>;

  onOptionAdded: (item: CatalogItemDto) => void;
  onOptionRemoved: (item: CatalogItemDto) => void;
  onClearOptions: () => void;
}
