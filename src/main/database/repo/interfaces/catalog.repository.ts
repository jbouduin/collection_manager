import { CatalogItemDto, CatalogTypeDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/types";
import { IResult } from "../../../services/base";


export interface ICatalogRepository {
  getCatalogItems(name: CatalogType, query: string): Promise<IResult<Array<CatalogItemDto>>>;
  getCatalogs(): Promise<IResult<Array<CatalogTypeDto>>>;
}
