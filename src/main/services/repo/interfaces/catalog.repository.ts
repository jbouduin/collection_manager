import { CatalogItemDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/enums";

export interface ICatalogRepository {
  getAll(name: CatalogType): Promise<Array<CatalogItemDto>>;
}
