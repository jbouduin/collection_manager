import { ICatalogItemDto, ICatalogTypeDto } from "../../../../common/dto";
import { CatalogType } from "../../../../common/types";
import { IResult } from "../../../services/base";


export interface ICatalogRepository {
  getCatalogItems(name: CatalogType, query: string): Promise<IResult<Array<ICatalogItemDto>>>;
  getCatalogs(): Promise<IResult<Array<ICatalogTypeDto>>>;
}
