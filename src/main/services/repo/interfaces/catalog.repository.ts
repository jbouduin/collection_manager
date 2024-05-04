import { CatalogType } from "../../../../common/enums";

export interface ICatalogRepository {
  sync(name: CatalogType, items: Array<string>): Promise<void>;
}
