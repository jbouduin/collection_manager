import { CatalogItemSelectDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/enums";

export interface ICatalogRepository {
  getAll(name: CatalogType): Promise<Array<CatalogItemSelectDto>>;
  sync(name: CatalogType, items: Array<string>): Promise<void>;
}
