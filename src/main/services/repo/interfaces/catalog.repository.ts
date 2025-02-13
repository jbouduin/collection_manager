import { CatalogItemDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/types";

export interface ICatalogRepository {
  getAll(name: CatalogType): Promise<Array<CatalogItemDto>>;
}
